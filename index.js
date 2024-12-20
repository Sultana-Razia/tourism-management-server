const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());




var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.qtkz8.mongodb.net:27017,cluster0-shard-00-01.qtkz8.mongodb.net:27017,cluster0-shard-00-02.qtkz8.mongodb.net:27017/?ssl=true&replicaSet=atlas-64o5c2-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.qtkz8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // await client.connect();

        const spotCollection = client.db('touristSpotDB').collection('touristSpot');


        app.get('/touristSpot', async (req, res) => {
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/touristSpot', async (req, res) => {
            const newSpot = req.body;
            // console.log(newSpot);
            const result = await spotCollection.insertOne(newSpot);
            res.send(result);
        })

        app.get('/myList/:email', async (req, res) => {
            // console.log(req.params.email);
            const result = await spotCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        })

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotCollection.findOne(query);
            // console.log(id);
            res.send(result);
        })

        app.put('/updateTouristSpot/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedTouristSpot = req.body;
            const touristSpot = {
                $set: {
                    touristSpot: updatedTouristSpot.touristSpot,
                    countryName: updatedTouristSpot.countryName,
                    location: updatedTouristSpot.location,
                    averageCost: updatedTouristSpot.averageCost,
                    photo: updatedTouristSpot.photo,
                    season: updatedTouristSpot.season,
                    travelTime: updatedTouristSpot.travelTime,
                    totalVisitorsPerYear: updatedTouristSpot.totalVisitorsPerYear,
                    description: updatedTouristSpot.description,
                }
            }
            const result = await spotCollection.updateOne(filter, touristSpot, options);
            res.send(result);
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotCollection.deleteOne(query);
            res.send(result);
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
    res.send('Tourism management server is running');
})


app.listen(port, () => {
    console.log(`Tourism server is running on port: ${port}`)
})