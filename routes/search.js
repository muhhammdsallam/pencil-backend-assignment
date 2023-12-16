const express = require('express');
const router = express.Router();
const getQuestions = require('../controllers/getQuestions');


router.route('/').get(getQuestions);

module.exports = router;