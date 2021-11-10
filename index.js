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

      app.post('/bikes', async (req, res) => {
         const bike = req.body;
         const result = await bikesCollection.insertOne(bike);
         console.log('hit The Post ')
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