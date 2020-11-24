const express = require('express');
const path = require('path');
const userControllers = require('../controllers/userControllers');

const router = express.Router();
router.get('/info', userControllers.getUser);


module.exports = router;