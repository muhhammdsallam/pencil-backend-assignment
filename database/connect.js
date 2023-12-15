const mongoose = require('mongoose');

const connectDatabase = (url)=>{
    mongoose.connect(url)
    .then(()=>console.log('Connected to database'))
}

module.exports = connectDatabase;