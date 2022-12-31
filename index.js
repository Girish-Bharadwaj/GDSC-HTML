//create express app
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');



//connect to mongodb atlas
var mongoose = require('mongoose');
const User = require("./models/User");
const uri = "mongodb+srv://snj:snj@cluster0.ndqer.mongodb.net/gdsc?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('strictQuery',false)
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});


app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

//create static path
app.use(express.static(path.join(__dirname, 'public')));

//create view engine
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');

//create routes
app.get('/', function(req, res){
    User.find({}, function(err, users){
        if(err){
            console.log(err);
            res.render('index', {
                users: []
            });
        } else {
            res.render('index', {
                users: users
            });
        }
    });
});

app.get('/signup', function(req, res){
    res.render('signup');
});

app.post('/signup', function(req, res){
    console.log(req.body);
    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        branch: req.body.branch,
        year: req.body.year,
        password: req.body.password,
        phone: req.body.phone,
        instagram: req.body.instagram,
        shareInstagram: req.body.shareInstagram=='on'?true:false,
    });
    newUser.save(function(err, user){
        if(err){
            console.log(err);
            res.render('signup');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/html/:username', function(req, res){
    User.findOne({username: req.params.username}, function(err, user){
        if(err){
          res.send('404');
        } else {
            res.send(user.html);
        }
    });
});

app.get('/edit/:username', function(req, res){
    User.findOne({username: req.params.username}, function(err, user){
        if(err){
            res.send('404');
        } else {
            res.render('edit', {
                user: user,
            });
        }
    });
});

app.post('/edit/:username', function(req, res){
   
    User.findOne({username: req.params.username,password:req.body.password}, function(err, user){
        if(err){
            res.send('An Error Occured while processing your request. Please try again later.');
        } else {
            if(user==null){
                res.send('Invalid Credentials');
            }
            else{
            user.html = req.body.html;
            user.modifiedCount = user.modifiedCount+1;
            user.save(function(err, user){
                if(err){
                    res.send('404');
                } else {
                    res.redirect('/');
                }
            });
        }
    }
    });
});



app.listen(3000, function(){
    console.log('Server started on port 3000...');
});