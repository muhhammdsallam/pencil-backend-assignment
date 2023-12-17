const Topic = require('../models/topic');
const Question = require('../models/question');
const performance = require('perf_hooks').performance;


//  @desc   returns an array of question numbers that have annotations that are descendants of the topic received in the request
//  @route  GET /search?q=topicName
//  @access public
//  @param  topicName
//  @return array of question numbers
const getQuestions = async (req, res) => {
  try {
    const start = performance.now();
    // Get the descendants of the topic received in the request
    const topicName = req.query.q;

    const queryTopic = await Topic.findOne({ name: topicName });

    if (!queryTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    // I'm assuming that we only search for descendants of the topic that is received in the request
    // and not the topic itself so I'm excluding it from the search

    // Escape special characters in the path
    const escapedPath = queryTopic.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Find descendants
    const regEx = new RegExp(`^${escapedPath}/`);
    const descendantTopics_ids = await Topic.find({ path: regEx , _id: { $ne: queryTopic._id}}).select('name').lean();
    if (descendantTopics_ids.length === 0) {
      return res.status(404).json({ error: 'Descendants not found' });
    }




    // get questions that have annotations that are descendants of the topic 
   const questions = await Question.find({ annotations: { $in: descendantTopics_ids } }).lean();
   if (questions.length === 0) {
      return res.status(404).json({ error: 'Questions not found' });
    }

    const end = performance.now();
    const duration = end - start;
    console.log(`Query took ${duration} milliseconds`);


    res.json(questions.map((question) => question.number));
    console.log('Questions loaded successfully');

    // printing the descendants for testing purposes
    console.log('number of descendants: ', descendantTopics_ids.length, 'number of questions: ', questions.length);

  } catch (error) {
    console.error('Error retrieving descendants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  
};



module.exports = getQuestions;