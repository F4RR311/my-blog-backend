import express from 'express';
import mongoose from "mongoose";
import multer from 'multer';

const PORT = 3100;
import {registerValidation, loginValidation, postCreateValidation} from './validadtions.js'
import {UserController, PostController} from './controllers/index.js'
import {validationErrors, checkAuth} from "./utils/index.js";

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.kafjq9l.mongodb.net/blog?retryWrites=true&w=majority'
)
    .then(() => {
        console.log('DB OK')
    })
    .catch((err) => {
        console.log('DB Error', err)
    });

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')

    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)

    }
})

const upload = multer({storage})

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, validationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/register', registerValidation, validationErrors, UserController.register);

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.get('/posts', postCreateValidation, PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, validationErrors, PostController.createPost)
app.delete('/posts/:id', checkAuth, PostController.removePost)
app.patch('/posts/:id', checkAuth, PostController.updatePost)

app.listen(PORT, (err) => {

    if (err) {
        return console.log(err)
    }


    console.log(`App listen on ${PORT} `)
})