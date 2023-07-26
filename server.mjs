import express from "express";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890', 20)
import { MongoClient } from "mongodb"

import './config/index.mjs'

const mongodbURI = "mongodb+srv://zafirabdullah1534:DellInspiren990@cluster0.ishtbna.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(mongodbURI);
const database = client.db('ecom');
const productCollection = database.collection('products');



const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("I am an Artificial Intelligence Engineer!")
});


let products = [
    {
        id: nanoid(), // Always a number
        name: "Laptop",
        price: "$300",
        description: "The Laptop is a good product"
    }
];

app.get("/products", async (req, res) => {
    console.log("get running");
    const result = await productCollection.find({}).toArray()
    console.log("result ",result);
    //  .then((result)=>{
    res.send({
        message: "all products",
        data: result,
    });
    //  })


});

//  https://baseurl.com/product/1231
app.get("/product/:id", (req, res) => {
    console.log(typeof req.params.id)

    if (isNaN(req.params.id)) {
        res.status(403).send("invalide product id");
    }

    let isFound = false;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === req.params.id) {
            isFound = i;
            break;
        }
    }

    if (isFound == false) {
        res.status(404);
        res.send({
            message: "product not found"
        });
    } else {
        res.send({
            message: "product not found with id: " + products[isFound].id,
            data: products[isFound]
        });
    }
});

app.post("/product", async (req, res) => {
    // {
    //     id: 212342, // Always a number
    //     name: "AI product",
    //     price: "$50.25",
    //     description: "AI product description"
    // }

    if (!req.body.name
        || !req.body.price
        || !req.body.description) {



        res.status(403).send(`
              required parameter missing. example JSON request body:
              {
                name: "Laptop",
                price: "$300",
                description: "The Laptop is a good product"
              }`);
    }

    await productCollection.insertOne({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    }).then(() => {
        res.status(201).send({ message: "created product" });

    }).catch((error) => {
        res.status(500).send({ error });

    })

});

app.put("/product/:id", (req, res) => {

    if (
        !req.body.name
        && !req.body.price
        && !req.body.description) {

        res.status(403).send(`
          required parameter missing.
          atleast one parameter is required: name, price or description to complete update
          example a JSON request body:
          {
            name: "Laptop",
            price: "$300",
            description: "The Laptop is a good product" 
          }`);
    }



    let isFound = false;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === req.params.id) {
            isFound = i;
            break;
        }
    }

    if (isFound === false) {
        res.status(404);
        res.send({
            message: "product not found"
        });
    } else {
        if (req.body.name) products[isFound].name = req.body.name
        if (req.body.price) products[isFound].price = req.body.price
        if (req.body.description) products[isFound].description = req.body.description

        res.send({
            message: "product is updated with id: " + products[isFound].id,
            data: products[isFound]
        });
    }

});

app.delete("/product/:id", (req, res) => {

    let isFound = false;

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === req.params.id) {
            isFound = i;
            break;
        }
    }

    if (isFound === false) {
        res.status(404);
        res.send({
            message: "product not found"
        });
    } else {
        products.splice(isFound, 1)

        res.send({
            message: "product is deleted"
        });
    }
});




const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});