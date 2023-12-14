const express = require('express');
const router = express.Router();
const getAllQuestions = require('../controllers/getQuestions'); //importing the getAllProducts function from the products controller


router.route('/').get(getAllQuestions); //get all products

module.exports = router; //export router to app.js