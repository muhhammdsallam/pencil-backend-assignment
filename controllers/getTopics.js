const Topic = require('../models/topic');

const getTopics = async (req, res) => {

    try {
        const topics = await Topic.find();
        console.log(topics);
        res.json(topics);

    }
    catch (error) {
        console.log(error);
    }
}

module.exports = getTopics;