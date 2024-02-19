import { parse } from "csv-parse";
import * as fs from 'node:fs';

const records = [];

// Here we are using built-in File System module for the Node.js to read the data file.
// It reads raw data of the file, it does not parse it.
fs.createReadStream('./data/kepler_data.csv')
    .on('data', (data) => {
        records.push(data);
    })
    .on('error', (err) => {
        console.log('Error while reading file', err);
    })
    .on('end', () => {
        console.log('Done with reading file!');
        console.log(`Found ${records.length} records`);
        console.log('records', records);
    });
