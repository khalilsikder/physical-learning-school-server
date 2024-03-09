const express = require('express');
const app = express();
const cors = require ('cors');
// const jwt = require('jsonwebtoken');
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

// const verifyJWT = (req,res,next) =>{
// const authorization = req.headers.authorization;
// if(!authorization){
//   return res.status(401).send({error:true,message:'unauthorize access'});
// }
// const token = authorization.split(' ')[1]
// jwt.verify(token.process.env.ACCESS_TOKEN_SECRET,(err,decoded) =>{
//   if(err){
//    return res.status(401).send({error:true,message:'unauthorize access'})
//   }
//   req.decoded = decoded;
//   next();
// })
// }

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
    const cartsCollection = client.db("physical").collection("carts");

    app.get('/users',async(req,res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })
    
    app.post('/users',async(req,res) => {
      const user = req.body
      const query = {email: user.email}
      const existingUser = await usersCollection.findOne(query)
      if(existingUser){
        return res.send({message: 'user already exists'})
      }
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    app.get('/carts',async(req,res) =>{
      const result = await cartsCollection.find().toArray();
      res.send(result); 
    })

    app.get("/carts" ,async(req,res) =>{
      const email = req.query.email;
      if(!email){
        res.send([]) 
      }
      const query = {email: email};
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    })

    app.post("/carts",async(req,res) =>{
      const item = req.body;
      console.log(item);
      const result = await cartsCollection.insertOne(item)
      res.send(result)
    })

    app.delete('/carts/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query)
      res.send(result)
    })

    // app.post('/jwt',(req,res) =>{
    //   const user = req.body;
    //   const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
    //   res.send({token})
    // })

    // app.get('/users/admin/:email', async(req,res) =>{
    //   const email = req.params.email;
    //   if(req.decoded.email !== email){
    //     res.send ({admin:false});
    //   }
    //   const query = {email: email};
    //   const user = await usersCollection.findOne(query);
    //   const result = {admin: user?.role === 'admin'}
    //   res.send(result);
    // })



    // app.patch('/users/admin/:id',async(req,res) =>{
    // const id = req.params.id;
    // const filter = {_id: new ObjectId(id)};
    // const updateDoc = {
    //   $set: {
    //     role: 'admin'
    //   },
    // };
    // const result = await usersCollection.updateOne(filter,updateDoc);
    // res.send(result)  
    // })

    

    // save instructor email
    // app.put('/carts/:email', async(req,res) =>{
    //   const email = req.params.email
    //   const user = req.body
    //   const query = {email: email }
    //   const options = {upsert: true }
    //   const updateDoc = {
    //     $set: user
    //   }
    //   const result = await cartsCollection.updateOne(query,updateDoc,options)
    //   console.log(result);
    //   res.send(result)
    // })

    

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