const express = require('express')
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;


//Middle wares
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wtcs29q.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      const serviceCollection = client.db('assignmentData').collection('services');
      
      // const projectsCollection = client.db('assignmentData').collection('portfolioProjects');
      const projectsCollection = client.db('assignmentData').collection('final-data');

      const reviewCollection = client.db('assignmentData').collection('reviews');

      app.get('/services', async(req, res) =>{
        const query ={}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });


      // My portfolio data service
      app.get('/projects', async(req, res) =>{
        const query ={}
        const cursor = projectsCollection.find(query);
        const services = await cursor.toArray();
        res.send(services);
      });


      // this is for home services 
      app.get('/homeservices', async(req, res) =>{
        const query ={}
        const homeCursor = serviceCollection.find(query);
        const homeServices = await homeCursor.limit(3).toArray();
        res.send(homeServices);
      });


      app.get('/services/:id', async(req, res) => {
        const id =req.params.id;
        const query = { _id: ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service);
      });

        // My portfolio data service
      app.get('/projects/:id', async(req, res) => {
        const id =req.params.id;
        const query = { _id: ObjectId(id)};
        const service = await projectsCollection.findOne(query);
        res.send(service);
      });

      //Review API data
      app.get('/reviews', async(req, res) =>{
        let query = {};
        if(req.query.email){
          query = {
            email: req.query.email
          }
        }
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
      })



      app.post('/reviews', async(req, res) =>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
      });

      app.delete('/reviews/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewCollection.deleteOne(query);
        res.send(result);
      })

    }
    finally{

    }

}

run().catch(err => console.error(err));






app.get('/', (req, res) => {
  res.send('assignment server is runing!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})