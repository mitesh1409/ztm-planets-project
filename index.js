import { parse } from "csv-parse";
import * as fs from 'node:fs';

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return (
        (planet.koi_disposition === 'CONFIRMED') &&
        (planet.koi_insol > 0.36 && planet.koi_insol < 1.11) &&
        (planet.koi_prad < 1.6)
    );
}

fs.createReadStream('./data/kepler_data.csv')
    .pipe(parse({
        columns: true,
        comment: '#',
    }))
    .on('data', (data) => {
        if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log('Error while reading file', err);
    })
    .on('end', () => {
        console.log('Read and processed planets data file.');
        console.log(`Found ${habitablePlanets.length} habitable planets.`);
        console.log('They are...');
        habitablePlanets.map(planet => console.log(planet.kepler_name));
    });
