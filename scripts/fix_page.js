const fs = require('fs');
const content = fs.readFileSync('/data/workspace/projects/saga/app/page.tsx', 'utf8');

// Find a suitable place to insert the link to bergvarme-kalkylator
const pattern = /\{"Vad är Fråga Saga\?"\}/;
if (content.includes("verktyg/franluftvarme-kalkylator") || content.includes("verktyg/bergvarme-kalkylator")) {
    console.log("Already linked in app/page.tsx content, though not sure where");
} else {
    console.log("No links found in app/page.tsx body");
}
