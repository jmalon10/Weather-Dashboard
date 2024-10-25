import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    console.log(`BEFORE WEATHER DATA`)
    // GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);
    console.log(`LOOK HERE:` , weatherData)
    // Save city to search history
    await HistoryService.addCity(city);
    console.log(`AFTER ADD CITY`)
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

// GET search history
router.get('/history', async (__req, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to fetch search history.' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error removing city from search history:', error);
    return res.status(500).json({ error: 'Failed to remove city from search history.' });
  }
});

export default router;

