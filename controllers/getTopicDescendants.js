const Topic = require('../models/topic');
const Question = require('../models/question');


//  @desc   returns an array of question numbers that have annotations that are descendants of the topic received in the request
//  @route  GET /search?q=topicName
//  @access public
//  @param  topicName
//  @return array of question numbers
const getTopicDescendants = async (req, res) => {
  try {
    // Get the descendants of the topic received in the request
    const topicName = req.query.q;

    const queryTopic = await Topic.findOne({ name: topicName });

    if (!queryTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }


    // Find descendants
    const regEx = new RegExp(`^${topicName}`);
    const descendantTopics_ids = await Topic.find({ path: regEx }).select('_id');

    if (!descendantTopics_ids || descendantTopics_ids.length === 0) {
      return res.status(404).json({ error: 'Descendants not found' });
    }

    // get questions that have annotations that are descendants of the topic 
   const questions = await Question.find({ annotations: { $in: descendantTopics_ids } }).lean();
     
    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: 'Questions not found' });
    }

    res.json(questions.map((question) => question.number));

  } catch (error) {
    console.error('Error retrieving descendants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  
};



module.exports = getTopicDescendants;