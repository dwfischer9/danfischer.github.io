const express = require("express");
const unirest = require("unirest");
const credentials = require('./apiCredentials.json'); 
const app = express();
    app.use(express.static(__dirname+'/public')); // location of my index.html
    app.get('/weather', (req, res) => {
        const {lat,lon} = req.query;
        let request = unirest("GET",`http://${credentials.host}/${lat},${lon}`);
        request.query({
            lang:"en",
            units:"auto"
        });
        request.headers({
            "dark-sky.p.rapidapi.com": credentials.host,
            "466375f66bmsh72031b571ea7c30p1f704fjsnc527236c3565": credentials.apiKey
        });
        
        request.end(response => {
            if(response.error) res.status(500).end();
            const{
                summary,
                precipProbability,
                temperature,
                windSpeed,
                windBearing
            } = response.body.currently;
            res.status(200).send(
                JSON.stringify({
                    summary: summary,
                    chanceOfRain: precipProbability,
                    temp: temperature,
                    wind:{
                        speed: windSpeed,
                        bearing: windBearing
                    }
                })
            );
        });
    });
    app.listen(3000,()=>{
        console.info('Listening on port :3000');
    });
