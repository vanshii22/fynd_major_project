require("dotenv").config();
const express=require('express');
const app=express()
const port=process.env.PORT || 5000;
const cors=require('cors');
const path = require ('path');

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

//middleware
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send(" ")
})

//mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://mern-book-store:hsCGGiVfr5WVOwHI@cluster0.m2rov42.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URL, {
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

    //create a collections for the documents
    const bookCollections=client.db("BookStore").collection("books");

    //insert a book to the database:post method-to send data into the database
    app.post("/upload-book",async(req,res)=>{
        const data=req.body;
        const result=await bookCollections.insertOne(data);
        res.send(result);
    })

// Get all boooks from database
app.get("/all-books", async (req, res) => {
  const { userId } = req.query;

  try {
    let query = {}; 

    if (userId) {
      query = { userId }; 
    }
    const books = await bookCollections.find(query).toArray();
    const totalCount = await bookCollections.countDocuments();
    res.send({books, totalCount });
  } catch (error) {
    res.status(500).send("Error fetching books");
  }

});

//update a Book data :patch or update methods
app.patch('/book/:id',async(req,res)=>{
  const id=req.params.id;
  const updateBookData=req.body;
  const filter={_id:new ObjectId(id) }

  const updateDoc={
    $set:{
      ...updateBookData
    },
  }
  const options={upsert:true};
  //update

  const result=await bookCollections.updateOne(filter,updateDoc,options);
  res.send(result);

})

//delete a book
app.delete('/book/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id:new ObjectId(id) };
  const result=await bookCollections.deleteOne(filter);
  res.send(result);

})

//find by category
app.get('/all-books',async(req,res)=>{
  let query={};
  if(req.query?.category){
    query={category:req.query.category}
  }
  const result=await bookCollections.find(query).toArray();
  res.send(result);
})

//To get single book data
app.get("/book/:id",async(req,res)=>{
  const id=req.params.id;
  const filter={_id:new ObjectId(id)};
  const result=await bookCollections.findOne(filter);
  res.send(result);

})

// create a collections for the contact information
const contactdetails=client.db("BookStore").collection("contact");

//Insert detials in the contact database :post method
app.post("/upload-details",async(req,res)=>{
  const data =req.body;
  const result=await contactdetails.insertOne(data);
  res.send(result);

})
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(" You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})