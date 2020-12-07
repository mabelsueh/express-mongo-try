// EXPRESS AND OTHER SETUP
const express = require('express');
// ./ required if not the file from ___ will be accessed
const MongoUtil = require('./MongoUtil.js');
const hbs = require('hbs');
const wax = require('wax-on');

// load in environment variables
require('dotenv').config();

// create the app
const app = express();
// allow us to load in view templates(handlebars-helpers in this case)
app.set('view engine', 'hbs');
// static files in folder named public
app.use(express.static('public'));
// form enabler
app.use(express.urlencoded({extended:false}));

// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// setup handlebars-helpers
var helpers = require('handlebars-helpers')({
    handlebars:hbs.handlebars
})

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    // tgc9_faults is the name of the database
    await MongoUtil.connect(MONGO_URL, "tgc9_fault");
    let db = MongoUtil.getDB();

    app.get('/', async (req, res)=>{
        //'faults' is the collection name
        let faults = await db.collection('faults').find().toArray();
        // rendering faults.hbs hence ('faults'
        res.render('faults',{
            // allFaults is just a key name u give and it is also used in the faults.hbs
            "allFaults":faults
        })
    })
 
    // display form for user to add input
    app.get('/faults/add', async (req,res)=>{
        res.render('add_fault');
    })

    app.post('/faults/add', async (req,res)=>{
        // res.send(req.body)
        let {fault, location, tags, block, name, email} = req.body;

        let newFault = {
            'fault': fault,
            'location': location,
            'tags' : tags,
            'block': block,
            'name': name,
            'email': email
        }
        await db.collection('faults').insertOne(newFault);
        res.redirect('/')
    })
}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})