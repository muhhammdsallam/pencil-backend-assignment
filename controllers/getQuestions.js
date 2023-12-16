const Question = require('../models/question');

const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        console.log(questions);
        res.json(questions);
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = getQuestions;