const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//local imports
const database = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//routes
const usersRoutes = require("./routes/users");

//routes handle requests
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
    res.send('<h1>AI IP Camera</h1>');
});

mongoose.connect(database.database, { useNewUrlParser: true }).then((result) => {
    app.listen(port, () => console.log(`Server started on port ${port}`));
}).catch(err => {
    console.log(err);
});