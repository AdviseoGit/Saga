const fs = require('fs');
const content = fs.readFileSync('/data/workspace/projects/saga/KAMPANJ.md', 'utf8');
const newContent = content.replace(
  '[ ] Optimera leadsformulär', 
  '[x] Optimera leadsformulär.\n  [ ] Driv in länkkraft till Bergvärme-kalkylator (den bäst konverterande) från startsidan.'
);
fs.writeFileSync('/data/workspace/projects/saga/KAMPANJ.md', newContent);
