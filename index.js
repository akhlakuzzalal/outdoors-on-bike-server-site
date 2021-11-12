const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

// user: Motor-bike-data
// pass: qWaccvg0iG2WxrsL

// Connect with mongo DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rolps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
   try {
      await client.connect();
      const database = client.db('MotorBikeData');
      const bikesCollection = database.collection('bikes');
      const users = database.collection('users');
      const reviews = database.collection('reviews')

      app.post('/bikes', async (req, res) => {
         const bike = req.body;
         const result = await bikesCollection.insertOne(bike);
         res.json(result);
      });
      // Post a review
      app.post('/reviews', async (req, res) => {
         const review = req.body;
         const result = await reviews.insertOne(review);
         res.json(result);
      })


      app.put('/users/:email', async (req, res) => {
         const email = req.params.email;
         console.log('put hit', email)
         const filter = { email: email };
         const option = { upsert: true };
         const updateDoc = {
            $set: {
               role: "admin"
            },
         };
         const result = await users.updateOne(filter, updateDoc, option);
         res.json(result);
      });
      app.put('/users', async (req, res) => {
         const user = req.body;
         const filter = { email: user.email };
         const options = { upsert: true };
         const updateUser = {
            $set: {
               name: user.name,
               img: user.img,
            },
         };
         const result = await users.updateOne(filter, updateUser, options)
         res.json(result);
      });

      // Get Bikes
      app.get('/bikes', async (req, res) => {
         const cursor = bikesCollection.find({});
         const allBikes = await cursor.toArray();
         res.json(allBikes);
      });
      // Get Reviews
      app.get('/reviews', async (req, res) => {
         const cursor = reviews.find({})
         const allReviews = await cursor.toArray();
         res.json(allReviews);
      })

      app.get('/users/:email', async (req, res) => {
         const email = req.params.email;
         const query = { email: email }
         const result = await users.findOne(query);
         res.json(result);
      })
   }
   finally {
      // await client.close();
   }
}
run().catch(console.dir)

app.get('/', (req, res) => {
   res.send('MOtor Bike Seling Server is RUnning');
});

app.listen(port, () => {
   console.log('server is running in localhost:', port)
})