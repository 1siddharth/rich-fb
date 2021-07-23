var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const Mongoose = require('mongoose')
var path = require('path')

const passport = require("passport")
const FB = require('passport-facebook').Strategy

const whitelist = ['http://localhost:3000', 'http://localhost:9000', 'https://richpanel-fb.herokuapp.com/']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}

var app = express();
const port = process.env.Port || 9000;
app.use(bodyParser.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'static')));
const auth = require("./route/auth")
const { session } = require('passport')
app.use(passport.initialize());
app.use(passport.session())

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'richpanel-fb/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'richpanel-fb/build', 'App.js'));
  });
}



passport.use(new FB({
  clientID: '505838213850978',
  clientSecret: '3c8e63f317be1559362f52a01bd1e789',
  callbackURL: "http://localhost:3000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


const mongoURI = 'mongodb+srv://fb-rich:fbrich@cluster0.bk7c4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const conn = Mongoose.createConnection(mongoURI ,
    {
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
Mongoose.connect(mongoURI ,
    {
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true,       
    })
    Mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

  app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, '/static/landing.html'));
  });
  app.get('/register', (req, res)=> {
    res.sendFile(path.join(__dirname, '/static/register.html'));
  });

  app.use('/auth', auth)



app.listen(port ,()=>{
    console.log("here")
})
