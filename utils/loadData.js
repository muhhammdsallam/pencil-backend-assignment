const fs = require('fs');
const csv = require('csv-parser');
const {MongoClient,ObjectId} = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

async function loadData() {
    
    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    try{
        
        const db = client.db(process.env.DB_NAME);
        console.log('Connected to database');

        const collection = db.collection(process.env.TOPICS_COLLECTION);
        // clear existing data from the collection
        await collection.deleteMany({});

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
                await insertIntoCollection(collection, tree);
                console.log('Tree:', tree);

                console.log('Data loaded successfully');
                client.close();
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

async function insertIntoCollection(collection, tree, parentId = null) {

    const documents = [];
  
    for (const [key, value] of Object.entries(tree)) {
      const document = {
        _id: new ObjectId(),
        name: key,
        parent: parentId,
      };
  
      // Recursively insert data for the children
      if (value && Object.keys(value).length > 0) {
        const childNodes = await insertIntoCollection(collection, value, document._id);
        if (childNodes && childNodes.length > 0) {
          document.children = childNodes;
        }
      }
  
      documents.push(document);
    }
  
    // Insert the documents into the MongoDB collection
    await collection.insertMany(documents);
  
    return documents; // Return the current level of the tree for recursive processing
  }

loadData();