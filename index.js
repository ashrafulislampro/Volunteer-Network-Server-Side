const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express()
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 5055



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0pfb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_CONNECT}`);
 
  app.delete('/deleteEvent/:id', (req, res)=>{
    const eventId = ObjectId(req.params.id);
    collection.findOneAndDelete({_id: eventId})
    .then(documents =>{
      console.log(documents)
      res.send(documents.ok > 0)
    })
  })

  app.get('/events', (req, res) => {
     collection.find()
     .toArray((err, items)=>{
       res.send(items);
     })
  })

  app.get('/event/:id', (req, res) => {
    collection.find({_id : ObjectId(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    collection.insertOne(newEvent)
    .then(result =>{
      res.send(result.acknowledged === true);
    })
  })

});

app.get('/', (req, res) => {
  res.send('Hello World working with node and mongodb')
})

app.listen(port);