const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

mongoose.connect('mongodb://0.0.0.0/inventory')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err))


const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
});
    
const Category = mongoose.model('Category', categorySchema);

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: Number,
    quantity: Number,
});

const Item = mongoose.model('Item', itemSchema);

app.use(express.json());

app.get('/', (req, res) => res.send('API is running.'))

//Category CRUD operations
app.post('/categories', async (req, res) => {
    if (req.query['id']) {
        const reqcat = await Category.findOne({'_id': req.query['id']});
        const status = await Category.updateOne({'_id': reqcat.id},{
            name: req.body.name ? req.body.name : reqcat.name,
            description: req.body.description ? req.body.description : reqcat.description,
        });
        res.send("Updated Catagory with status: " + status.acknowledged);
    }
    else {
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });
        await category.save();
        res.send("Created Catagory with id: " + category.id);
    }
});

app.get('/categories', async (req, res) => {
    if (req.query['id']) cat = await Category.findOne({'_id': req.query['id']})
    else {
        cat = await Category.find()
        cat.unshift({"Total entries in Catagory: " : cat.length})
    }
    res.send(cat)
})

app.delete('/categories', async (req,res) => {
    const id = req.query['id']
    reqcat = await Category.findOne({'_id': id})
    if (reqcat) {
        await Category.deleteOne({'_id': id})
        res.send("Deleted Category with id: " + id)
    }

})


//Item CRUD operations
app.post('/items', async (req, res) => {
    const reqcat = await Category.findOne({"name" : "Food"})
    if (req.query['id']) {
        const reqitem = await Item.findOne({'_id': req.query['id']});
        const status = await Item.updateOne({'_id': reqitem.id},{
            name: req.body.name ? req.body.name : reqitem.name,
            description: req.body.description ? req.body.description : reqitem.description,
            category: req.body.category ? reqcat : reqitem.category,
            price: req.body.price ? req.body.price : reqitem.price,
            quantity: req.body.quantity ? req.body.quantity : reqitem.quantity,
        });

        res.send("Updated Item with status: " + status.acknowledged);
    }
    else {
        const item = new Item({
            name: req.body.name,
            description: req.body.description ,
            category: reqcat,
            price: req.body.price ,
            quantity:  req.body.quantity,
        });
        await item.save();
        res.send("Created Item with id: " + item.id);
    }
    
});

app.get('/items', async (req, res) => {
    if (req.query['id']) item = await Item.findOne({'_id': req.query['id']})
    else {
        item = await Item.find().populate('category')
        item.unshift({"Total entries in Item: " : item.length})
    }
    res.send(item)
    
})

app.delete('/items', async (req,res) => {
    const id = req.query['id']
    reqitem = await Item.findOne({'_id': id})
    if (reqitem) {
        await Item.deleteOne({'_id': id})
        res.send("Deleted Item with id: " + id)
    }else res.send("Id not found.")

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))