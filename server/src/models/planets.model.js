const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo')

function isHabitablePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}


function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#', // ignores hashtag
                columns: true // returns js objects
            }))
            // connecting a readable stream source to a destination

            .on('data', async (data) => { 
                if(isHabitablePlanet(data)){
                    savePlanet(data);
                }
            })

            .on('error', (err) => {
                console.log(err)
                reject(err)
            })

            .on('end', async() => {
                const countPlanetsFound = (await getAllPlanets()).length
                console.log(`${countPlanetsFound} planets found!`);
                resolve();
            });
            // chaining of different event handlers
        })
}

async function getAllPlanets(){
    return await planets.find({}, {
        '__v': 0, '_id': 0,
    })
}

async function savePlanet(planet){
    try{
    await planets.updateOne({
        keplerName: planet.kepler_name // if it's new
    }, {
        keplerName: planet.kepler_name // if it exists already
    }, {
        upsert: true, // upsert or no
    });
    // creates a mongo collection}  
    } catch(err){
        console.error(`Couldn't save planet ${err}`)
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets // don't need unhabitables
};
