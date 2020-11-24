const express = require('express');
const path = require('path');
const hotelControllers = require('../controllers/hotelControllers');

const router = express.Router();
router.get('/', hotelControllers.getHotels);
router.get('/:id', hotelControllers.getHotel);
router.post('/search', hotelControllers.searchHotels);

module.exports = router;