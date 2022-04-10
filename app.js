var express = require('express');
var path = require('path');

var app = express();
var fs = require('fs'); // Import fs module

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const db = require("./Controller/Control");


const session = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

const JSON = require('JSON');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));





app.get('/', function(req, res) {
    res.render('login');
});

app.post('/', function(req, res) {
    db.LoginUser(req, res);
})

app.get('/registration', function(req, res) {
    res.render('registration');
});

app.post('/registration', function(req, res) {
    db.CreateUser(req, res);
});

app.get('/home', function(req, res) {
    db.CheckUser(req, res, "home");
});

app.get('/books', function(req, res) {
    db.CheckUser(req, res, "books");
});

app.get('/leaves', function(req, res) {
    db.CheckUser(req, res, "leaves");
});

app.post('/leaves', function(req, res) {
    db.AddCart(req, res, "leaves");
});

app.get('/sun', function(req, res) {
    db.CheckUser(req, res, "sun");
});

app.post('/sun', function(req, res) {
    db.AddCart(req, res, "sun");
});

app.get('/boxing', function(req, res) {
    db.CheckUser(req, res, "boxing");
});

app.post('/boxing', function(req, res) {
    db.AddCart(req, res, "boxing");
});

app.get('/cart', function(req, res) {
    db.ShowCart(req, res);
});

app.get('/galaxy', function(req, res) {
    db.CheckUser(req, res, "galaxy");
});

app.post('/galaxy', function(req, res) {
    db.AddCart(req, res, "galaxy");
});

app.get('/sports', function(req, res) {
    db.CheckUser(req, res, "sports");
});

app.get('/phones', function(req, res) {
    db.CheckUser(req, res, "phones");
});

app.get('/iphone', function(req, res) {
    db.CheckUser(req, res, "iphone");
});

app.post('/iphone', function(req, res) {
    db.AddCart(req, res, "iphone");
});

app.get('/tennis', function(req, res) {
    db.CheckUser(req, res, "tennis");
});

app.post('/tennis', function(req, res) {
    db.AddCart(req, res, "tennis");
});

app.get('/searchresults', function(req, res) {
    db.CheckUser(req, res, "searchresults");
});

app.post('/search', function(req, res) {
    db.SearchProd(req, res);


});




const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));