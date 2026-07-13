const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const importGenAI = `import { GoogleGenAI } from "@google/genai";\n`;

const transcribeRoute = `
app.post("/api/transcribe", upload.single("media"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No media file provided" });
  }

  const inputFile = req.file.path;
  const mimeType = req.file.mimetype || "audio/mp3";

  try {
    console.log(\`Starting AI Transcription for \${req.file.originalname}\`);
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Upload file to Gemini
    const uploadResult = await ai.files.upload({
      file: inputFile,
      mimeType: mimeType,
    });
    
    // Generate content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        uploadResult,
        { text: 'Transcribe the audio in this file line by line. Output a JSON array of objects with "text" (the spoken text, or "..." if it is just music/silence without speech), "start" (in seconds, float), and "end" (in seconds, float). Keep segments relatively short (e.g., 2-5 seconds) for subtitles.' }
      ],
      config: { 
        responseMimeType: 'application/json' 
      }
    });

    const text = response.text;
    if (text) {
        const jsonMatch = text.match(/\\[[\\s\\S]*\\]/);
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
`;

code = code.replace('import https from "https";', 'import https from "https";\n' + importGenAI);
code = code.replace('async function startServer() {', transcribeRoute + '\nasync function startServer() {');

fs.writeFileSync('server.ts', code);
