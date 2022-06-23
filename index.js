import express from 'express';
import mongoose from "mongoose";

const PORT = 3100;
import {registerValidation, loginValidation, postCreateValidation} from './validadtions.js'
import checkAuth from './utils/checkAuth.js'
import {register, login, getMe} from './controllers/UserController.js'
import {createPost, getAll, getOne, removePost, updatePost} from './controllers/PostController.js'

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.kafjq9l.mongodb.net/blog?retryWrites=true&w=majority'
)
    .then(() => {
        console.log('DB OK')
    })
    .catch((err) => {
        console.log('DB Error', err)
    });

const app = express();
app.use(express.json());

app.post('/auth/login', login, loginValidation);
app.get('/auth/me', checkAuth, getMe);
app.post('/auth/register', registerValidation, register);


app.get('/posts', postCreateValidation, getAll)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, createPost)
app.delete('/posts/:id', checkAuth, removePost)
app.patch('/posts/:id', checkAuth, updatePost)

app.listen(PORT, (err) => {


    if (err) {
        return console.log(err)
    }

    console.log(`App listen on ${PORT} `)
})