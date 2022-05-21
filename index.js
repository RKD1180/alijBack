const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hmdql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("sclManage");
    const teacherCollection = database.collection("teacher");
    const studentCollection = database.collection("student");
    const blogCollection = database.collection("blog");

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await teacherCollection.findOne({ email, password });

      if (!user) {
        return res.json({
          status: "error",
          error: "Email/password is Invalid",
        });
      } else {
        res.json({
          message: "Login successful",
          status: "success",
          user,
        });
      }
    });

    // student login
    app.post("/studentlogin", async (req, res) => {
      const { email, password } = req.body;
      const user = await studentCollection.findOne({ email, password });

      if (!user) {
        return res.json({
          status: "error",
          error: "Email/password is Invalid",
        });
      } else {
        res.json({
          message: "Login successful",
          status: "success",
          user,
        });
      }
    });

    // create teacher
    app.post("/teacher", async (req, res) => {
      const teacher = req.body;
      const result = await teacherCollection.insertOne(teacher);
      res.json(result);
    });

    // create student
    app.post("/student", async (req, res) => {
      const student = req.body;
      const result = await studentCollection.insertOne(student);
      res.json(result);
    });

    // create blog
    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.json(result);
    });

    // get teacher
    app.get("/teacher", async (req, res) => {
      const cursor = teacherCollection.find({});
      const teacher = await cursor.toArray();
      res.send(teacher);
    });

    // get student
    app.get("/student", async (req, res) => {
      const cursor = studentCollection.find({});
      const student = await cursor.toArray();
      res.send(student);
    });

    // get blog
    app.get("/blog", async (req, res) => {
      const cursor = blogCollection.find({});
      const blog = await cursor.toArray();
      res.send(blog);
    });

    // get single student
    app.get("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const student = await studentCollection.findOne(query);
      res.send(student);
    });

    // update teacher
    app.get("/teacher/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const teacher = await teacherCollection.findOne(query);
      res.send(teacher);
    });

    // delete a teacher
    app.delete("/teacher/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const teacher = await teacherCollection.deleteOne(query);
      res.send(teacher);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my Server");
});

app.listen(port, () => {
  console.log("Runnig Server on port", port);
});
