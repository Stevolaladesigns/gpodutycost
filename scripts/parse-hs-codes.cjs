const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../files.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const lines = fileContent.split(/\r?\n/).filter(l => l.trim().length > 0);

const data = [];
for (let i = 1; i < lines.length; i++) {
    // split by tab or 2+ spaces
    const parts = lines[i].split(/\t|\s{2,}/);
    if (parts.length >= 2) {
        data.push({
            code: parts[0].trim(),
            desc: parts[1].trim()
        });
    }
}

const outDir = path.join(__dirname, '../public/data');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'hs-codes.json'), JSON.stringify(data));
console.log('Done! Wrote ' + data.length + ' items to public/data/hs-codes.json');
