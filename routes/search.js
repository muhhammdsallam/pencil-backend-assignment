const express = require('express');
const router = express.Router();
const getTopicDescendants = require('../controllers/getTopicDescendants');


router.route('/').get(getTopicDescendants);

module.exports = router;