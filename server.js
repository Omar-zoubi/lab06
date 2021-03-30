'use strict'
require("dotenv").config();
const PORT= process.env.PORT;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/location', hanLoc);
app.get('/weather', hanWeath);

function hanLoc(request , response)
{
    const searchQ = request.query.city;
    const locJson = require('./data/location.json');
    const newLoc = new Location (locJson[0], request.query.city);
    console.log(newLoc);
    response.send(newLoc);
}
function Location(data, nameS)
{
    this.search_query= nameS;
    this.formatted_query = data.display_name;
    this.latitude= data.lat;
    this.longitude= data.lon;
    
}
function Weather(data)
{
    this.forcast= data.weather.description;
    this.time = data.datetime;
}
function hanWeath(request, response)
{
    const locJson = require('./data/weather.json');
    const resultArr= [];
    locJson.data.forEach(item =>{
        resultArr.push({forcast: item.weather.description , time: item.datetime})
    });
    response.send(resultArr);

}
app.listen(PORT, ()=> console.log(`app is runing on server on port: ${PORT}`));