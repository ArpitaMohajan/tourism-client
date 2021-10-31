const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kvbsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

async function run() {
    try {
        await client.connect();
        // console.log('hi')
        const database = client.db("sundarban");
        const serviceCollection = database.collection("services");
        const orderCollection = database.collection("addOffer")
        const manageCollection = database.collection("orders")
        //    get
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        // post
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('hit', service)
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })
        // get
        app.get('/addOffer', async (req, res) => {
            const cursor = orderCollection.find({})
            const order = await cursor.toArray()
            res.send(order)
        })
        // addOffer
        app.post("/addOffer", async (req, res) => {
            console.log(req.body);
            const result = await orderCollection.insertOne(req.body);
            console.log(result);
        });
        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })

        // // add users
        app.get('/orders', async (req, res) => {
            const cursor = manageCollection.find({})
            const orde = await cursor.toArray()
            res.send(orde)
        })
        // post users
        app.post('/orders', async (req, res) => {
            const ordering = req.body;
            console.log('hitting', ordering)
            const result = await manageCollection.insertOne(ordering)
            console.log(result)
            res.json(result)
        })


        // delete Api
        app.delete('/dltOrders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await manageCollection.deleteOne(query)
            console.log(result)
            res.json(result)
        })





    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello')
})
app.listen(port, () => {
    console.log('Listening to port', port)
})

// sundarban =pass
// sundarbanAssign-name