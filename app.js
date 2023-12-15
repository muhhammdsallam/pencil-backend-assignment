const express = require('express');
require('dotenv').config();
const connectDB = require('./database/connect');

const app = express();

app.use(express.json()); // Parse JSON bodies

//routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to pencil spaces backend assignment' });
});
app.use('/search', require('./routes/search'));



const port = process.env.PORT || 3000;

const start = async () => {
    
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        })}
        catch (error) {
            console.log(error);
        }
     }

start();

