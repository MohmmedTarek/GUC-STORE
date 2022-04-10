const uri = "mongodb+srv://admin:Pass123@cluster0.9ocob.mongodb.net/StoreDB?retryWrites=true&w=majority";
const { MongoClient } = require("mongodb");
var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const JSON = require('JSON');
const session = require('express-session');

var userID = undefined;


async function CreateUser(req, res) {

    const { username, password } = req.body;
    let errors = [];

    if (!username || !password) {
        errors.push({ msg: 'Please enter all fields' });
    } else {
        if (username.length < 4) {
            errors.push({ msg: 'Username must be at least 4 characters' });
        }

        if (password.length < 6) {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }
    }
    if (errors.length > 0) {
        res.render('registration', {
            errors,
            username,
            password,

        });
    } else {

        await client.connect(function(err) {
            if (err) {
                console.log("\n--can not connect to MongoDB--\n\n", err.message, CreateUser(req, res));
            } else {
                console.log('--MongoDB Connected--')


                //check if the user exists
                client.db("StoreDB").collection("users").findOne({ UserName: username }).then(user => {
                    if (user) {
                        errors.push({ msg: 'Username already exists' });
                        res.render('registration', { errors, username, password });
                    } else {
                        const result = { UserName: username, Password: password, Cart: [] };
                        client.db("StoreDB").collection("users").insertOne(result)
                            .then(user => {
                                userID = req.session;
                                userID.username = result.UserName;
                                res.redirect('/home');
                            })
                            .catch(err => res.send(err.message), console.log(err));
                    }
                });
            }
        });
    }
}

async function LoginUser(req, res) {

    const { username, password } = req.body;
    let errors = [];

    if (!username || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('login', {
            errors,
            username,
            password,

        });
    } else {

        // Connect to MongoDB
        await client.connect(function(err) {
            if (err) {
                console.log("\n--can not connect to MongoDB--\n\n", err.message, LoginUser(req, res));
            } else {
                console.log('--MongoDB Connected--')

                //check if the user exists
                client.db("StoreDB").collection("users").findOne({ UserName: username }).then(user => {
                    if (!user) {
                        errors.push({ msg: 'The Username not registered' });
                        res.render('login', { errors, username, password });
                    } else {
                        client.db("StoreDB").collection("users").findOne({ UserName: username, Password: password }).then(user => {
                            if (!user) {
                                errors.push({ msg: 'Password incorrect' });
                                res.render('login', { errors, username });
                            } else {
                                userID = req.session;
                                userID.username = username;
                                res.redirect('/home');

                            }
                        });
                    }
                });
            }
        });
    }

}

async function CheckUser(req, res, page) {
    if (userID != undefined) {
        res.render(page);
    } else {
        res.redirect('/');
    }
    res.end;
}

async function AddCart(req, res, page) {
    let errors = [];

    await client.connect(function(err) {
        if (err) {
            console.log("\n--can not connect to MongoDB--\n\n", err.message, AddCart(req, res, page));
        } else {
            console.log('--MongoDB Connected--')

            client.db("StoreDB").collection("users").findOne({ UserName: userID.username, Cart: { $in: [page] } }).then(product => {
                if (product) {

                    errors.push({ msg: 'The Product already Added To the Cart' });
                    res.render(page, { errors });

                    console.log("--error The Product already Added--");
                } else {

                    client.db("StoreDB").collection("users").updateOne({ UserName: userID.username }, { $push: { Cart: page } }).then(product => {
                        if (!product) {
                            errors.push({ msg: product.message });
                            AddCart(req, res, page);


                        } else {
                            errors.push({ msg: 'the product has been added successfully' });
                            res.render(page, { errors });
                        }
                    });
                }
            });
        }

    });

}

async function SearchProd(req, res) {
    var text = req.body.Search;
    var SearchRecords = [];

    if (text == undefined) {

    } else {


        var temp = ["Galaxy S21 Ultra", "iPhone 13 Pro", "Leaves of Grass", "The Sun and Her Flowers", "Boxing Bag", "Tennis Racket"];
        var flage = false;

        for (let i = 0; i < temp.length; i++) {
            if (temp[i].toLowerCase().includes(text.toLowerCase())) {
                SearchRecords.push(temp[i]);
                flage = true;
            }
        }

        if (flage == false) {
            SearchRecords.push("Not found");
        }
    }
    res.render("searchresults", { searcharray: SearchRecords });
}

async function ShowCart(req, res) {
    if (userID == undefined) {
        res.redirect('/');
    } else {


        // Connect to MongoDB
        await client.connect(function(err) {
            if (err) {
                console.log("\n--can not connect to MongoDB--\n\n", err.message, LoginUser(req, res));
            } else {
                console.log('--MongoDB Connected--');
                x();

                async function x() {
                    await client.db("StoreDB").collection("users").findOne({ UserName: userID.username }, { Cart: 1, _id: 0 }).then(product => {
                        if (product) {

                            userID.userCART = product.Cart;
                            res.render("cart", { ProductsList: userID.userCART });
                        }
                    });
                }
            }
        });
    }
}


module.exports = { LoginUser, CreateUser, CheckUser, AddCart, SearchProd, ShowCart };