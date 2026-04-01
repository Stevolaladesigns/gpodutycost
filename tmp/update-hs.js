import fs from 'fs';
const path = 'd:\\STEVE BACKUP\\ghanapost duty cost\\public\\data\\hs-codes.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
data.push({ code: '392290', desc: 'Bathing Sponge' });
fs.writeFileSync(path, JSON.stringify(data, null, 0));
console.log('Update complete');
