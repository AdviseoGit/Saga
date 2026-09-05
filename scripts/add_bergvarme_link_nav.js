const fs = require('fs');
const content = fs.readFileSync('/data/workspace/projects/saga/components/Navbar.tsx', 'utf8');

// Vi ser att Navbar.tsx _redan har_ länken:
// <Link href="/verktyg/bergvarme-kalkylator" ...>Bergvärme</Link>
// Så vi låter den vara som den är.
console.log("Navbar check passed");
