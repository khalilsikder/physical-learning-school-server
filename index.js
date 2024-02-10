const express = require('express');
const app = express();
const cors = require ('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
// middleware
const corsOptions = {
  origin: '*',
  crediantials: true,
  optionSuccessStatus: 200  
}
app.use(cors(corsOptions));
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.fazwg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("physical").collection("users");

    app.get("/users",async(req,res) =>{
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    app.get("users",async(req,res) =>{
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      const query = {email:email};
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    })

    // save instructor email
    app.put('/users/:email', async(req,res) =>{
      const email = req.params.email
      const user = req.body
      const query = {email: email }
      const options = {upsert: true }
      const updateDoc = {
        $set: user
      }
      const result = await usersCollection.updateOne(query,updateDoc,options)
      console.log(result);
      res.send(result)
    })
    app.delete('/users/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('physical learning is ok')
})
app.listen(port,()=>{
    console.log(`physical learning is listening ${port}`);
})