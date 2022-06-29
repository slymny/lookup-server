// import express from 'express';
const express = require('express');
const axios = require('axios');

// import router from './router.js';
const {router, getImage} = require('./router.js');
const countries = require('country-data').countries;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT;

app.use('/weather/', router);

app.use(express.static('public'));

app.get('/', (req, res) => {
  const d = new Date();
  res.json({currentTime: d.toTimeString()});
  console.log('Received a GET request');
});

app.get('/:location', async (req, response) => {
  const location = req.params.location;
  let image;
  let weatherData;
  let error;
  if (location !== 'undefined') {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY_WEATHER}&units=metric`;
      weatherData = await axios(url);
    } catch (err) {
      console.log(err.message);
      error = err;
    }

    if (weatherData) {
      let photos = await getImage(weatherData.data.name);
      if (photos.length > 0) {
        image = photos[0].src.landscape;
      } else {
        photos = await getImage(countries[weatherData.data.sys.country].name);
        if (photos.length > 0) {
          image = photos[0].src.landscape;
        } else {
          image = '';
        }
      }
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    if (error) response.send({error});
    else response.send({data: weatherData.data, image});
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
