const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/crud_login_app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db=>{
    console.log("mongodb connected")
}).catch( err => console.log(err))