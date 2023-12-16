const fs = require('fs');
const csv = require('csv-parser');
const connectDatabase = require('../database/connect');
const Topic = require('../models/topic');
const Question = require('../models/question');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

async function loadTopicData() {

    try{
        // Connect to the database
        await connectDatabase(process.env.MONGO_URI);

        // Clear existing data from the collection
        await Topic.deleteMany({});

        // read the data from the csv file
            const rows = [];
            fs.createReadStream(process.env.TOPICS_CSV_FILE_PATH)
            .pipe(csv())
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', async () => {
                // console.log('Rows array:', rows);
    
                // build the hierarchial structure of the data and insert into the collection
                const tree = buildTree(rows);
                await insertIntoCollection(tree);
                console.log('Tree:', tree);

                console.log('Data loaded successfully');
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
            });}
                
                catch (error) {
                    console.log(error);
                }

}

function buildTree(rows) {

    const tree = {};
    const columnNames = Object.keys(rows[0]);

    rows.forEach(row => {
        let currentNode = tree;
    
        // iterate through the row and build the tree
        for(const level of columnNames) {
    
            const topic = row[level];
            if(topic) {
                if(!currentNode[topic]) {
                    currentNode[topic] = {};
                }
                currentNode = currentNode[topic];
            }
        }
    });
    
    return tree;
}

async function insertIntoCollection(tree, parentPath = null) {
    const children = [];
  
    for (const [key, value] of Object.entries(tree)) {


      const path = parentPath ? `${parentPath},${key}` : key;
  
      const topic = new Topic({
        _id: new mongoose.Types.ObjectId(),
        name: key,
        path: path,
      });
  
      await topic.save();
  
      // Recursively insert data for the children
      if (value && Object.keys(value).length > 0) {
        const childIds = await insertIntoCollection(value, topic.path);
        children.push(...childIds);
      }
  
      children.push(topic._id);
    }
  
    return children;
  }

  async function loadQuestions() {
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
    } finally {
      // Optionally close the database connection here if needed
    }
  }




  

loadTopicData();
loadQuestions();