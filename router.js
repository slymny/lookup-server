const {Router} = require('express');
const axios = require('axios');
require('dotenv').config();
const countries = require('country-data').countries;

let router = Router();

router.get('/:location', async (req, response) => {
  const location = req.params.location;
  let image;
  let weatherData;
  let error;

  try {
    const url = `${process.env.API_WEATHER_URL}/weather?q=${location}&appid=${process.env.API_KEY_WEATHER}&units=metric`;
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
});

async function getImage(query) {
  try {
    const cityImageRes = await axios(
      `${process.env.API_IMAGE_URL}/search?query=${query}`,
      {
        headers: {
          Authorization: process.env.API_KEY_IMAGE,
        },
      },
    );
    return cityImageRes.data.photos;
  } catch (err) {
    console.log(err.message);
    return '';
  }
}

router.get('/forecast/:location', async (req, response) => {
  const location = req.params.location;
  let weatherData;
  let error;

  try {
    const url = `${process.env.API_WEATHER_URL}/forecast?q=${location}&appid=${process.env.API_KEY_WEATHER}&units=metric`;
    weatherData = await axios(url);
  } catch (err) {
    console.log(err);
    error = err;
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  if (error) response.send({error});
  else response.send(weatherData.data);
});

module.exports = {router, getImage};
