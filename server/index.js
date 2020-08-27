const axios = require('axios');
const cheerio = require('cheerio')
const CronJob = require('cron').CronJob;

const siteUrl = "http://www.sismologia.cl/links/tabla.html";

// CONSTANTS TO ACCESS earthquakes ARRAY
const DATE = 0
const LOCATION = 1
const SPECIFICLOCATION = 2
const MAGNITUDE = 3

let lastEarthquake = 0
let earthquakes = []

const getEarthquakes = () => { 
    axios.get(siteUrl)
    .then(result => {
        // Load HTML
        const $ = cheerio.load(result.data)
        /* The target is a table with 3 columns
            DATE | LOCATION | MAGNITUDE
            so, we'll create a row to save those columns
        */
        let row = []
        let index = 0
        //let isNewEarthquake = false;
        
        $('tbody td').each((i, el) => {
            row.push(($(el).text()))

            if (index === LOCATION) {
                let specificLocation = extractSpecificLocation($(el).text())
                row.push(specificLocation)
            }

            if (index === 2) {
                earthquakes.push(row)
                row = []
                index = -1
            }
            index++
        })
        console.log(earthquakes)
    })
    .catch(error => console.log(error))
}


const extractSpecificLocation = (element) => {
    const elementSplit = element.split(' ')
    return elementSplit[elementSplit.length - 1]
}

const isNewEarthquake = (earthquakeDate) => {
    if (earthquakeDate > lastEarthquake) {
        return true
    }
    return false
}

getEarthquakes()

// const job = new CronJob('*/5 * * * * *', function() {
// 	const d = new Date();
// 	console.log('Every 5 seconds:', d);
// });
// job.start();