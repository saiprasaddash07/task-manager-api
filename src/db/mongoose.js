const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, 
    {
        useUnifiedTopology: true ,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify:false,
    }
);



// const newTask = new task({
//     description:"Water plants",
//     completed:false
// });

// newTask.save().then(()=>{
//     console.log(newTask);
// }).catch(e => {
//     console.log(e);
// });