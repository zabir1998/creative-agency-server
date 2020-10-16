const express = require('express');
const bodyParser= require('body-parser');
const fileUpload = require("express-fileupload");

const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpuow.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("services"));
app.use(fileUpload());


const port = 5000;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("creativeAgency").collection("services");
  const reviewsCollection = client.db("creativeAgency").collection("reviews");
  const ordersCollection = client.db("creativeAgency").collection("orders");
  const adminsCollection = client.db("creativeAgency").collection("admins");

//   app.post('/addServices',(req,res)=>{
//       const services=req.body;
//       console.log(services)
//       servicesCollection.insertMany(services)
//       .then(result=>{
//         console.log(result.insertedCount);
//           res.send(result.insertedCount)
//       })
//   })
  
//   app.post('/addReviews',(req,res)=>{
//     const reviews=req.body;
//     console.log(reviews)
//    reviewsCollection.insertMany(reviews)
//     .then(result=>{
//       console.log(result.insertedCount);
//         res.send(result.insertedCount)
//     })
// })

app.post("/addService", (req, res) => {
  const file = req.files.file;
  const name = req.body.name;
  const description = req.body.description;
  const newImg = file.data;
  const encImg = newImg.toString("base64");

  var image = {
    contentType: file.mimetype,
    size: file.size,
    img: Buffer.from(encImg, "base64"),
  };

  servicesCollection
    .insertOne({ name, description, image })
    .then((result) => {
      res.send(result.insertedCount > 0);
    });
});


app.get("/services", (req, res) => {
  servicesCollection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});

app.get("/reviews", (req, res) => {
  reviewsCollection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});

app.post("/addReview", (req, res) => {
  const review = req.body;
  reviewsCollection.insertOne(review).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.get("/servicesOrdered", (req, res) => {
  ordersCollection
    .find({ email: req.query.email })
    .toArray((err, documents) => {
      res.send(documents);
    });
});

app.get("/allServicesOrdered", (req, res) => {
  ordersCollection.find({}).toArray((err, documents) => {
    res.send(documents);
  });
});

app.post("/addOrder", (req, res) => {
  const order = req.body;
  ordersCollection.insertOne(order).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.post("/addAdmin", (req, res) => {
  const admin = req.body;
  adminsCollection.insertOne(admin).then((result) => {
    res.send(result.insertedCount > 0);
  });
});

app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email }).toArray((err, admins) => {
      res.send(admins.length > 0);
    });
  });


  //client.close();
});
app.get("/", (req, res) => {
  res.send("Welcome to Creative Agency BackEnd!");
});

app.listen(port)