const express = require('express');
const router = express.Router();
const getQuestions = require('../controllers/getQuestions');
const getTopicDescendances = require('../controllers/getTopicDescendances');


router.route('/').get(getTopicDescendances);

module.exports = router;