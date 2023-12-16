const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true},
  path: { type: String},
});

// Indexing the path field for efficient search
topicSchema.index({ path: 1 });

// Indexing the name field for efficient search
topicSchema.index({ name: 1 });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;