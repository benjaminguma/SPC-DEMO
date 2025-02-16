const csvFilePath = './conversation-topics.csv';
import csv from 'csvtojson';
import { writeFileSync } from 'fs';

const jsonArray = await csv().fromFile(csvFilePath);
writeFileSync('./p.json', JSON.stringify(jsonArray), {
  encoding: 'utf-8',
});
