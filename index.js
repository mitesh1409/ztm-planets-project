import { parse } from "csv-parse";
import path from "node:path";
import * as fs from 'node:fs';

const allRecords = [];
const habitablePlanets = [];

// Initialize the CSV parser.
const csvParser = parse({
    comment: '#',
    columns: true,
    delimiter: ',',
    skip_empty_lines: true,
});

const filePath = path.resolve(process.cwd(), 'kepler_data.csv');

function isHabitablePlanet(planet) {
    return (
        (planet.koi_disposition === 'CONFIRMED') &&
        (planet.koi_insol > 0.36 && planet.koi_insol < 1.11) &&
        (planet.koi_prad < 1.6)
    );
}

fs.createReadStream(filePath)
    .on('error', (error) => console.log('Error while reading data file', error))
    .pipe(csvParser)
    .on('error', (error) => console.log('Error while parsing CSV file', error))
    .on('data', (data) => {
        allRecords.push(data);

        if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (error) => console.error('Error', error))
    .on('end', () => {
        const csvHabitablePlanets = habitablePlanets.map((planet) => planet.kepler_name).join();

        console.log('Read and processed planets data file.');
        console.log(`Total records = ${allRecords.length}.`);
        console.log(`Habitable Planets = ${habitablePlanets.length}.`);
        console.log(`They are - ${csvHabitablePlanets}`);
    });
