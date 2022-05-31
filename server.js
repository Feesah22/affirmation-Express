// access the express modules
const express = require('express') 
//app is telling us to run express function 
const app = express() 
// declaring a variable to breakup a string into a object //built in express  
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
//declaring variables to use later 
var db, collection;
// url that connects to 
//const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const url = 'mongodb+srv://feesah22:coder223@cluster0.blmz1.mongodb.net/?retryWrites=true&w=majority';
const dbName = "Smile"

app.listen(2900, () => { //listening to port waiting for server to be run 
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
      console.log("listen 2900");
    });//lets us know we have sucessful connected to the database
});

app.set('view engine', 'ejs') //has to come befor any app. files so HTML can be rendered

//These two lines is needed to look at the request body
app.use(bodyParser.urlencoded({extended: true}))//body parser will be applied to the url
app.use(bodyParser.json()) //body parser will be applied to stringified JSON
app.use(express.static('public')) //anything in the public folder, it is ran on server immediately no route needed

app.get('/', (req, res) => {// get request for when the page is loaded and url contains "/" or invisible slash (home page)
  db.collection('affirmations').find().toArray((err, result) => { //gathering all the messages in the database and putting them into an array 
    if (err) return console.log(err) // is something is wrong please rell me 
    res.render('index.ejs', { affList: result}) //put messages into index.ejs so that it will render the messages on dom 
  })
})

app.post('/createAffirmation', (req, res) => { //get create a new object (document) with the collection call messages in the cluster. 
  db.collection('affirmations').insertOne({emotion: req.body.feeling, affirmation: req.body.affirmationText, completed:false}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/favoriteAffirmation', (req, res) => { //update request after some action 
  db.collection('affirmations')
    .findOneAndUpdate({ emotion: req.body.feeling, affirmation: req.body.text, completed: false }, { //we are finding the name /message in the db that matches the name/message targeted by main.js event
    $set: {
      completed:true
    
    }
  }, {
    sort: {_id: -1},
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/deleteAffirmation', (req, res) => { //a delete request 
  db.collection('affirmations').findOneAndDelete({ emotion: req.body.feeling, affirmation: req.body.affirmationText
}, (err, result) => { // find matching name/message object in database 
    if (err) return res.send(500, err)
    res.send('Affirmation deleted!')
  })
})
