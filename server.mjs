import express from "express";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890', 20)
import { MongoClient, ObjectId } from "mongodb"
import cors from "cors"
import './config/index.mjs'

const mongodbURI = "mongodb+srv://zafirabdullah1534:DellInspiren990@cluster0.ishtbna.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(mongodbURI);
const database = client.db('ecom');
const productCollection = database.collection('products');




const app = express();
app.use(cors())

app.use(express.json());

app.get("/", (req, res) => {
    res.send("I am an Artificial Intelligence Engineer!")
});


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


});

app.post("/product", async (req, res) => {
    
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

app.put("/product/:id", async (req, res) => {

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

await productCollection.findOneAndUpdate({_id:new ObjectId(req.params.id)},{
    $set:{
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    }
}).then(()=>{
 res.status(200).json({
    message:"Product Updated Successfully"
 })
}).catch((error)=>{
    res.status(500).json({
        error
     })
})


});

app.delete("/product/:id", async (req, res) => {
         const {id}  = req.params
  await  productCollection.findOneAndDelete({_id:new ObjectId(id)}).then(()=>{
    res.status(200).json({
        message:"Product Deleted Successfully"
     })
  }).catch((error)=>{
    res.status(500).json({
        error
     })
  })
    
});




const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});