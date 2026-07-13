import express from "express";
import path from "path";
import multer from "multer";
import { spawn } from "child_process";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import https from "https";
import { GoogleGenAI } from "@google/genai";


const app = express();
const PORT = 3000;

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// API to enhance audio using our Python AI Model

app.get("/api/proxy-audio", (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') return res.status(400).send('No URL provided');
  
  
  https.get(url, (proxyRes) => {
    const headers = { ...proxyRes.headers };
    headers['Access-Control-Allow-Origin'] = '*';
    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send('Proxy error');
  });
});

app.post("/api/enhance-audio", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file provided" });
  }

  const inputFile = req.file.path;
  const outputFile = `${inputFile}_enhanced.mp4`;

  console.log(`Starting AI Enhancement for ${req.file.originalname}`);

  // Spawn the Python process
  let stderrData = "";
  const pythonProcess = spawn('python3', ['ai_model.py', inputFile, outputFile]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`AI Model: ${data.toString().trim()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`AI Model Error: ${data}`);
    stderrData += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`AI Enhancement completed successfully.`);
      res.download(outputFile, 'enhanced_media.mp4', (err) => {
        // Clean up files after sending
        try {
          fs.unlinkSync(inputFile);
          fs.unlinkSync(outputFile);
        } catch (e) {
          console.error("Cleanup error", e);
        }
      });
    } else {
      console.error(`AI Model exited with code ${code}`);
      res.status(500).json({ error: "AI processing failed", details: stderrData });
      try {
        fs.unlinkSync(inputFile);
      } catch (e) {}
    }
  });
});


app.post("/api/transcribe", upload.single("media"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No media file provided" });
  }

  const inputFile = req.file.path;
  const mimeType = req.file.mimetype || "audio/mp3";

  try {
    console.log(`Starting AI Transcription for ${req.file.originalname}`);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Upload file to Gemini
    const uploadResult = await ai.files.upload({
      file: inputFile,
      config: { mimeType },
    });
    
    const targetLanguage = req.body.language || "English";
    // Generate content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        uploadResult,
        { text: `Transcribe the audio in this file. Translate the transcription to ${targetLanguage} if the original language is different. Keep the translation accurate. Output a JSON array of objects with "text" (the spoken text/translation, or "..." if it is just music/silence without speech), "start" (in seconds, float), and "end" (in seconds, float). Keep segments relatively short (e.g., 2-4 seconds) and multi-line if needed (using \n) so they fit nicely as subtitles. Format the result as a valid JSON array.` }
      ],
      config: { 
        responseMimeType: 'application/json' 
      }
    });

    const text = response.text;
    if (text) {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        const subtitles = JSON.parse(jsonStr);
        res.json({ subtitles });
    } else {
        res.status(500).json({ error: "No response text" });
    }
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ error: "Transcription failed", details: String(error) });
  } finally {
    try {
      fs.unlinkSync(inputFile);
    } catch (e) {}
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
