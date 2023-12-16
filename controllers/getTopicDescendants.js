const Topic = require('../models/topic');
const Question = require('../models/question');

const getTopicDescendants = async (req, res) => {
  try {
    // Get the descendants of the topic received in the request
    const topicName = req.query.q;

    const queryTopic = await Topic.findOne({ name: topicName });

    if (!queryTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }


    const path = queryTopic.path;
    // Find descendants
    const queryDescendants = { path: { $regex: `^${path}`, $ne: path } };
    const descendantTopics = await Topic.find(queryDescendants);

    if (!descendantTopics || descendantTopics.length === 0) {
      return res.status(404).json({ error: 'Descendants not found' });
    }
    

    // Extract names and paths of descendant topics
    const descendantData = descendantTopics.map((topic) => ({
      Id: topic._id,
      name: topic.name,
      path: topic.path,
    }));

    console.log(descendantData);

    // get questions that have annotations that are descendants of the topic
   const query = { annotations: { $in: descendantTopics.map((topic) => topic._id) } };
   const questions = await Question.find(query);

  // Extract question numbers
  const questionNumbers = questions.map((question) => question.number);

  console.log(questions);
  res.json(questionNumbers);

  } catch (error) {
    console.error('Error retrieving descendants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  
};

// const getQuestions = async (req, res) => {

//   try {

//     // Get the descendants of the topic received in the request
//     const topicName = req.query.q;


//   }
// }    

module.exports = getTopicDescendants;