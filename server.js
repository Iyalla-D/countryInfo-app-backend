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
    console.error('Error fetching country language data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

app.get('/api/country/currency/:currency', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/currency/${req.params.currency}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching country currency data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

app.get('/api/country/region/:region', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/region/${req.params.region}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching country region data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

app.get('/api/country/subregion/:subregion', async (req, res) => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/subregion/${req.params.subregion}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching country subregion data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
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
          languagesMap.set(code, language);
        });
      }
    });

    res.json(Array.from(languagesMap, ([code, language]) => ({code, language})));
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

app.get('/api/currencies', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const allCountries = response.data;

    const currenciesMap = new Map();
    allCountries.forEach(country => {
      if (country.currencies) {
        Object.entries(country.currencies).forEach(([code, {name, symbol}]) => {
          currenciesMap.set(code, {name, symbol});
        });
      }
    });
    
    res.json(Array.from(currenciesMap, ([code, {name, symbol}]) => ({code, name, symbol })));

  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
});

app.get('/api/subregions', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const allCountries = response.data;

    const subregionsSet = new Set(allCountries.map(country => country.subregion).filter(subregion => subregion));
    res.json([...subregionsSet]);
  } catch (error) {
    console.error('Error fetching subregions:', error);
    res.status(500).json({ error: 'Failed to fetch subregions' });
  }
});

app.get('/api/country/filter/filters', async (req, res) => {
  try {
    const { language, currency, region, subregion } = req.query;
    let endpoint = 'https://restcountries.com/v3.1/all';

    const response = await axios.get(endpoint);
    let filteredCountries = response.data;

    if (language) {
      filteredCountries = filteredCountries.filter((country) =>{
        const languages = country.languages;
        return languages && Object.keys(languages).includes(language);
      });
    }

    if (currency!== undefined && currency !== null) {
      filteredCountries = filteredCountries.filter((country) => {
        const currencies = country.currencies;
        return currencies && Object.keys(currencies).includes(currency);
      });
    }

    if (region) {
      filteredCountries = filteredCountries.filter(
        (country) => country.region === region
      );
    }

    if (subregion) {
      filteredCountries = filteredCountries.filter(
        (country) => country.subregion === subregion
      );
    }
    
    res.json(filteredCountries);
  } catch (error) {
    console.error('Error fetching filtered country data:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
