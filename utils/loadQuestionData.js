const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const connectDatabase = require('../database/connect');
const Topic = require('../models/topic');
const Question = require('../models/question');
const dotenv = require('dotenv');

dotenv.config();

async function loadQuestionData() {
    try {
      await connectDatabase(process.env.MONGO_URI);
      await Question.deleteMany(); // Clear existing data
  
      // Read the question data from the CSV file
      const stream = fs.createReadStream(process.env.QUESTIONS_CSV_FILE_PATH).pipe(csv());
  
      for await (const row of stream) {
        const question = new Question({
          _id: new mongoose.Types.ObjectId(),
          number: parseInt(row['Question number']),
          annotations: [],
        });
  
        for (let i = 1; i <= 5; i++) {
          const annotationName = row[`Annotation ${i}`];
  
          if (annotationName) {
            try {
              // Wait for the asynchronous Topic.findOne operation to complete
              const topic = await Topic.findOne({ name: annotationName });
  
              if (!topic) {
                console.log(`Topic not found: ${annotationName}`);
              } else {
                question.annotations.push(topic._id);
              }
            } catch (error) {
              console.error(`Error finding topic: ${error}`);
            }
          }
        }
        // Insert the current question into the database
        try {
          await question.save();
          console.log(`Question ${question.number} saved successfully.`);
        } catch (error) {
          console.error(`Error saving question ${question.number}: ${error}`);
        }
      }
  
      console.log('Questions loaded successfully');
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }


loadQuestionData();  