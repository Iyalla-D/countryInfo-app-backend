const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;



app.use(cors());

app.get('/api/country/:country', async (req, res) => {
  
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${req.params.country}`);
    if (!response.data || response.data.length === 0) {
      throw new Error('No data returned from external API');
    }
    const countryData = response.data[0];

    const {
      name,
      capital,
      population,
      area,
      languages,
      flags,
      currencies,
      latlng
    } = countryData;
    
    res.json({
      name: name.common,
      official_name: name.official,
      nativeNames: name.nativeName,
      capital: capital[0],
      population: population,
      area: area,
      languages: languages,
      flag: flags.png,
      flag_alt: flags.alt,
      currency: {
        name: Object.values(currencies)[0].name,
        symbol: Object.values(currencies)[0].symbol,
      },
      latlng: latlng
    });
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});


app.get('/api/country/language/:language', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/lang/${req.params.language}`);
    // ... handle response and send back relevant data
  } catch (error) {
    // ... handle error
  }
});

app.get('/api/country/currency/:currency', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/currency/${req.params.currency}`);
    // ... handle response and send back relevant data
  } catch (error) {
    // ... handle error
  }
});

app.get('/api/country/region/:region', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/region/${req.params.region}`);
    // ... handle response and send back relevant data
  } catch (error) {
    // ... handle error
  }
});

app.get('/api/country/subregion/:subregion', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/subregion/${req.params.subregion}`);
    // ... handle response and send back relevant data
  } catch (error) {
    // ... handle error
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
