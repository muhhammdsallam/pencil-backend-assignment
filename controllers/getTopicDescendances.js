const Topic = require('../models/topic');

const getTopicDescendances = async (req, res) => {
  try {
    // Get the descendants of the topic received in the request
    const topicName = req.query.q;

    const queryTopic = await Topic.findOne({ name: topicName });

    if (!queryTopic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const path = queryTopic.path;

    // Find descendants
    const query = { path: { $regex: `^${path}`, $ne: path } };
    const descendantTopics = await Topic.find(query);

    // Extract names of descendant topics
    const descendantNames = descendantTopics.map((topic) => topic.name);

    res.json(descendantNames);
  } catch (error) {
    console.error('Error retrieving descendants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = getTopicDescendances;