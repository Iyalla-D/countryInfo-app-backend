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
      latlng,
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
      latlng: latlng,
    });
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});


app.get('/api/country/language/:language', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/lang/${req.params.language}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
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
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching country data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

app.get('/api/country/subregion/:subregion', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/subregion/${req.params.subregion}`);
    res.json(response.data);
  } catch (error) {
    // ... handle error
  }
});

app.get('/api/languages', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const allCountries = response.data;

    const languagesMap = new Map();
    allCountries.forEach(country => {
      if (country.languages) {
        Object.entries(country.languages).forEach(([code, language]) => {
          languagesMap.set(language, code);
        });
      }
    });

    res.json(Array.from(languagesMap, ([language, code]) => ({ language, code })));
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

app.get('/api/regions', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const allCountries = response.data;

    const regionsSet = new Set(allCountries.map(country => country.region).filter(region => region));
    res.json([...regionsSet]);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
