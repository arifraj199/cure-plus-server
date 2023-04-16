const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nswzdpm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("treatment").collection("service");
    const reviewCollection = client.db("treatment").collection("review");

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.limit(3).toArray();
      res.send(result);
    });

    app.get("/allservices", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/allservices", async (req, res) => {
      const addedService = req.body;
      const result = await serviceCollection.insertOne(addedService);
      res.send(result);
    });

    app.get("/allservices/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray(cursor);
      res.send(result);
    });

    app.post("/review", async (req, res) => {
      const userReview = req.body;
      console.log(userReview);
      const result = await reviewCollection.insertOne(userReview);
      res.send(result);
    });

    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("cureplus is running on the server");
});

app.listen(port, () => {
  console.log("app is running on the port ", port);
});
