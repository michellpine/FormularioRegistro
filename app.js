const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

//middlewears 
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//bd connection
//mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", function (e) { console.error(e); });

var schema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

var Visitor = mongoose.model("Visitor", schema);


//get register users
app.get('/', async (req, res) => {
    await Visitor.find(function (err, visitors) {
        if (err) return console.error(err, visitors);
        console.log("pintando " + visitors);
        res.render('index', { visitors: visitors });
    });
});

//sing up
app.get('/register', (req, res) => {
    res.render('register');
});

//create a visitor
app.post('/register', async (req, res) => {
    const password = req.body.password;
    await bcrypt.hash(password, 10).then(function (hash) {
        Visitor.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
    });
    console.log("visitor create: " + req.body.name + req.body.email);
    res.redirect("/");
});

app.listen(3000, () => console.log('Listen on port 3000!'));