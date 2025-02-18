//user name: mdnishatislam2006
//password: TNio63wo2eEIgyuD


const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

app.use(cors())
app.use(express.json())


//mongobd

const uri = "mongodb+srv://mdnishatislam2006:TNio63wo2eEIgyuD@cluster0.niknw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const database = client.db("usersDB");
    const userCollction = database.collection("users");



    app.get('/users', async (req, res) => {
      const cursor = userCollction.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const user = await userCollction.findOne(query);
      res.send(user)
    })

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id
      const updateUser = req.body
      console.log(id, updateUser)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateuser = {
        $set: {
          name: updateUser.name,
          email: updateUser.email
        },
      };
      const result = await userCollction.updateOne(filter, updateuser, options);
      res.send(result)

    })


    app.post('/users', async (req, res) => {
      const user = req.body
      console.log('new user', user)
      const result = await userCollction.insertOne(user);
      res.send(result)
    })



    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('plase delete udser', id)

      const query = { _id: new ObjectId(id) };
      const result = await userCollction.deleteOne(query);
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






app.get('/', (req, res) => {
  res.send('crud is running')
})

app.listen(port, () => {
  console.log(`simple crud is running${port}`)
})