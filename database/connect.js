const mongoose = require('mongoose');

const connectDatabase = (url) => {
    return mongoose.connect(url)
        .then(() => console.log('Connected to database'))
        .catch((error) => console.error('Error connecting to database:', error));
};

module.exports = connectDatabase;