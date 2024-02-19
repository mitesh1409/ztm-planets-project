import { parse } from "csv-parse";
import * as fs from 'node:fs';

const records = [];

fs.createReadStream('./data/kepler_data.csv')
    .pipe(parse({
        columns: true,
        comment: '#',
    }))
    .on('data', (data) => {
        records.push(data);
    })
    .on('error', (err) => {
        console.log('Error while reading file', err);
    })
    .on('end', () => {
        console.log('Done with reading file!');
        console.log(`Found ${records.length} records`);
        // console.log('records', records);
    });
