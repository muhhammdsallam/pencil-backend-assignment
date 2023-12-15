const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
    }],
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;