const fs = require('fs');
const content = fs.readFileSync('/data/workspace/projects/saga/app/page.tsx', 'utf8');

const targetStr = `            {cards.map((card, i) => (`;

const ctaHtml = `          <div className="mt-8 mb-4">
            <p className="text-center text-sm font-medium text-slate-500 max-w-2xl mx-auto">
              Ska du investera i värmepump eller bergvärme? Se till att räkna på kostnaden först med vår populära <a href="/verktyg/bergvarme-kalkylator" className="text-[#6366f1] hover:underline font-bold">Bergvärme Kalkylator</a>.
            </p>
          </div>
`;

if (content.includes(targetStr)) {
  const newContent = content.replace(targetStr, ctaHtml + targetStr);
  fs.writeFileSync('/data/workspace/projects/saga/app/page.tsx', newContent);
  console.log("Success");
} else {
  console.log("Target string not found");
}
