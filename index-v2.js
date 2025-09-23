import { parse } from "csv-parse";
import path from 'node:path';
import * as fs from 'node:fs';

const allRecords = [];
const habitablePlanets = [];

// Configure CSV parser.
const csvParser = parse({
    comment: '#',
    columns: true,
    delimiter: ',',
    skip_empty_lines: true,
});

const csvDataFilePath = path.resolve(process.cwd(), 'kepler_data.csv');

function isHabitablePlanet(planet) {
    return (
        (planet.koi_disposition === 'CONFIRMED') &&
        (planet.koi_insol > 0.36 && planet.koi_insol < 1.11) &&
        (planet.koi_prad < 1.6)
    );
}

const readStream = fs.createReadStream(csvDataFilePath);

// Handle "error" event for the read stream.
readStream.on('error', (error) => {
    console.error('Error while reading file');
    console.error('Error:', error.message);
});

// Handle "error" event for the CSV parser.
csvParser.on('error', (error) => {
    console.error('Error while parsing CSV file');
    console.error('Error:', error.message);
});

// Pipe read stream into CSV parser.
readStream.pipe(csvParser);

// Consuming readable streams with async iterators
// This is possible because csvParser is an instance of Parser class,
// which implements stream.Transform of Node.js,
// that in turn implements stream.Readable of Node.js.
// And finally it is possible to consume readable stream with async iterators
// https://nodejs.org/api/stream.html#consuming-readable-streams-with-async-iterators
try {
    for await (const record of csvParser) {
        allRecords.push(record);

        if (isHabitablePlanet(record)) {
            habitablePlanets.push(record);
        }
    }
} catch (error) {
    console.error('Error while consuming readable stream');
    console.error('Error:', error.message);
}

const csvHabitablePlanets = habitablePlanets.map((planet) => planet.kepler_name).join();

console.log('Read and processed planets CSV data file.');
console.log(`Total records = ${allRecords.length}.`);
console.log(`Habitable Planets = ${habitablePlanets.length}.`);
console.log(`They are - ${csvHabitablePlanets}`);
