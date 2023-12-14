const mongoose = require('mongoose');

const connecDatabase = (url)=>{
    mongoose.connect(url)
    .then(()=>console.log('Connected to database'))
}

module.exports = connecDatabase;