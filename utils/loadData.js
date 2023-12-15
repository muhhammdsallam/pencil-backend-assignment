const fs = require('fs');
const csv = require('csv-parser');
const connectDatabase = require('../database/connect');
const Topic = require('../models/topic');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

async function loadData() {

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

async function insertIntoCollection(tree, parentId = null) {
    const children = [];

    for (const [key, value] of Object.entries(tree)) {
        const topic = new Topic({
            _id: new mongoose.Types.ObjectId(),
            name: key,
            parent: parentId,
        });

        await topic.save();

        // Recursively insert data for the children
        if (value && Object.keys(value).length > 0) {
            const childObjects = await insertIntoCollection(value, topic._id);
            topic.children = childObjects;
            await topic.save();
        }

        children.push(topic);
    }

    return children;
}

loadData();