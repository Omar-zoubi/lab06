'use strict'
require("dotenv").config();
const superagent = require('superagent');
const PORT = process.env.PORT;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PARKS_API_KEY = process.env.PARKS_API_KEY;

app.get('/location', hanLoc);
app.get('/weather', hanWeath);
app.get('/parks', hanParks);

function hanLoc(request, response) {
    const searchQ = request.query.city;
    // const locJson = require('./data/location.json');
    // console.log(searchQ);
    const url = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${searchQ}&format=json`;
    superagent.get(url).then(Element => {
        const newLoc = new Location(searchQ, Element.body[0]);
        response.send(newLoc);
    });

}
function Location(nameS, data) {
    this.search_query = nameS;
    this.formatted_query = data.display_name;
    this.latitude = data.lat;
    this.longitude = data.lon;

}
function Weather(data) {
    // this.searchQ=searchQ;
    this.forecast = data.weather.description;
    this.datetime = data.datetime;

}
function hanWeath(request, response) {
    const searchQ = request.query.search_query;
    console.log(searchQ)
    // const locJson = require('');
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?KEY=${WEATHER_API_KEY}&city=${searchQ}&country=US`;
    superagent.get(url).then(item => {
        const newObj = item.body.data.map(El => {
            return new Weather(El);
        });
        response.send(newObj);
    });

}
function Parks(data) {
    this.name= data.name;
    this.address=`${data.addresses[0].line1} ${data.addresses[0].city} ${data.addresses[0].stateCode} ${data.addresses[0].postalCode}`;
    this.fees=0.00;
    this.park_url= data.url;
// console.log(address);
}
function hanParks(request, response) {
    const searchQ = request.query.search_query;
    const url =`https://developer.nps.gov/api/v1/parks?city=${searchQ}&api_key=${PARKS_API_KEY}&limit=10`;
    superagent.get(url).then(data =>{
        // console.log(item)
        const newObj = data.body.data.map(El => {
            return new Parks(El);
    });
    response.send(newObj);

});

}
app.listen(PORT, () => console.log(`app is runing on server on port: ${PORT}`));