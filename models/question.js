const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  
  _id: mongoose.Schema.Types.ObjectId,
  number: { type: Number, required: true},
  annotations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
  
});

// Indexing the number field for efficient search
questionSchema.index({ number: 1 });
// Indexing the annotations field for efficient search
questionSchema.index({ annotations: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;