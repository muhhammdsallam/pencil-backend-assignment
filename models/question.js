const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

  questionNumber: { type: Number, required: true, unique: true },

  annotations: [{ type: String }],
  
});

// Indexing the annotations field for efficient search
questionSchema.index({ annotations: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;