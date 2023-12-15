const express = require('express');
const router = express.Router();
const getAllQuestions = require('../controllers/getQuestions');
const getTopics = require('../controllers/getTopics');


router.route('/').get(getTopics);

module.exports = router;