const mongoose = require('mongoose');


const url = `mongodb+srv://user:pradumna143@cluster0.f7uqy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose
.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('connected to the database'));
