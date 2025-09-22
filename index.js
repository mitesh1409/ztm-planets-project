import { parse } from "csv-parse";
import path from "node:path";
import * as fs from 'node:fs';

const records = [];

// Initialize the CSV parser.
const csvParser = parse({
    comment: '#',
    columns: true,
    delimiter: ',',
    skip_empty_lines: true,
});

const filePath = path.resolve(process.cwd(), 'kepler_data.csv');

fs.createReadStream(filePath)
    .on('error', (error) => console.log('Error while reading data file', error))
    .pipe(csvParser)
    .on('error', (error) => console.log('Error while parsing CSV file', error))
    .on('data', (data) => records.push(data))
    .on('error', (error) => console.error('Error', error))
    .on('end', () => console.log(`Found ${records.length} records.`));
