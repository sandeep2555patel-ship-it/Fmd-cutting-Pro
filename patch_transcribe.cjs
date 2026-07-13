const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const OLD = `    // Generate content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        uploadResult,
        { text: 'Transcribe the audio in this file line by line. Output a JSON array of objects with "text" (the spoken text, or "..." if it is just music/silence without speech), "start" (in seconds, float), and "end" (in seconds, float). Keep segments relatively short (e.g., 2-5 seconds) for subtitles.' }
      ],
      config: { 
        responseMimeType: 'application/json' 
      }
    });`;

const NEW = `    const targetLanguage = req.body.language || "English";
    // Generate content
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        uploadResult,
        { text: \`Transcribe the audio in this file. Translate the transcription to \${targetLanguage} if the original language is different. Keep the translation accurate. Output a JSON array of objects with "text" (the spoken text/translation, or "..." if it is just music/silence without speech), "start" (in seconds, float), and "end" (in seconds, float). Keep segments relatively short (e.g., 2-4 seconds) and multi-line if needed (using \\n) so they fit nicely as subtitles. Format the result as a valid JSON array.\` }
      ],
      config: { 
        responseMimeType: 'application/json' 
      }
    });`;

code = code.replace(OLD, NEW);
fs.writeFileSync('server.ts', code);
