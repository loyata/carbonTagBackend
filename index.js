import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import jwt from 'jsonwebtoken'

import {
    getCategories,
    getCountry,
    getFabric,
    getKPI,
    getPost,
    getPosts, getSubStacks,
    getWeight,
    savePost,
    saveSubStack
} from "./database.js";


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());

const PORT = 8080


const admin = {username:"admin", password:"admin"};
app.post('/users/admin', async (req, res) => {
    const {username, password} = req.body;
    try{
        if(username !== admin.username) return res.json('No Such User');
        if(password !== admin.password) return res.json('Invalid Password');
        const token = jwt.sign({username, identity: "admin"},'test')
        res.send(token);
    }catch (e){
        res.status(500).json({message: 'Something went wrong'})
    }
})

app.get('/', (req, res) => {
    res.render("homepage")
})

app.get('/ghg/:fabric', async (req, res) => {
    const fabric = req.params.fabric
    const result = await getFabric(fabric);
    res.json(result)
})

app.get('/ghg/:fabric/:method', async (req, res) => {
    const result = await getCountry(req.params.fabric, req.params.method);
    res.json(result)
})

app.get('/ghg/:fabric/:method/:country', async (req, res) => {
    const result = await getKPI(req.params.fabric, req.params.method, req.params.country)
    res.json(result)
})

app.get('/weight/:name', async (req, res) => {
    const result = await getWeight(req.params.name)
    res.json(result['weight'])
})

app.get('/weight', async (req, res) => {
    const result = await getCategories();
    res.json(result)
})

app.get('/posts', async (req, res) => {
    const result = await getPosts();
    res.json(result)
})

app.get('/substack', async (req, res) => {
    const result = await getSubStacks();
    res.json(result)
})

app.get('/post/:id', async (req, res) => {
    const result = await getPost(req.params.id)
    res.json(result)
})

app.post('/post/new', async (req, res) => {
    console.log(req.body)
    await savePost(req.body)
    res.json("success")
})

app.post('/substack', async (req, res) => {
    console.log(req.body);
    await saveSubStack(req.body);
    res.json("success");
})




app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})


module.exports = app