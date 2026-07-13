const fs = require('fs');
let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

const OLD = `        const formData = new FormData();
        formData.append("media", blob, "media.mp4");

        const apiRes = await fetch("/api/transcribe", {`;

const NEW = `        const formData = new FormData();
        formData.append("media", blob, "media.mp4");
        formData.append("language", captionLanguage);

        const apiRes = await fetch("/api/transcribe", {`;

code = code.replace(OLD, NEW);
fs.writeFileSync('src/components/MediaBin.tsx', code);
