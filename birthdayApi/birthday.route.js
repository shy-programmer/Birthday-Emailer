const ValidateCelebrant = require('../utils/birthday.validator');
const celebrantController = require('./birthday.controller');
const express = require('express');
const router = express.Router()

router.post('/', ValidateCelebrant, celebrantController.createCelebrant);
router.get('/', celebrantController.getCelebrants);

module.exports = router;