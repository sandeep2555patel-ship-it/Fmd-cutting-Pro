const fs = require('fs');

let code = fs.readFileSync('src/components/MediaBin.tsx', 'utf8');

// I'll just change the URLs in the ALL_AUDIO array to wrap them in /api/proxy-audio?url=
// Actually it's easier to just do it when they are added to the timeline, but we also want the preview to work.
// But we don't have preview for audio in MediaBin. We add them to timeline.
// Let's replace the raw URLs in ALL_AUDIO with the proxied ones.

code = code.replace(/url: '(https:\/\/cdn\.pixabay\.com[^']+)'/g, "url: `/api/proxy-audio?url=${encodeURIComponent('$1')}`");
code = code.replace(/url: '(https:\/\/files\.freemusicarchive\.org[^']+)'/g, "url: `/api/proxy-audio?url=${encodeURIComponent('$1')}`");
code = code.replace(/url: '(https:\/\/www\.myinstants\.com[^']+)'/g, "url: `/api/proxy-audio?url=${encodeURIComponent('$1')}`");

fs.writeFileSync('src/components/MediaBin.tsx', code);
