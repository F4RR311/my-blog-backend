import express from 'express';
import mongoose from "mongoose";

const PORT = 3100;
import {registerValidation} from './validation/auth.js'
import {validationResult} from "express-validator";
import UserModel from './models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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
app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный ЛЛогин или пароль'
            })
        }
        const token = jwt.sign({
                _id: user._id,
            }, 'secret123',
            {
                expiresIn: '7d'
            }
        );
        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Can`t авторизоваться'
        })
    }
})

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({

            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarIrl,
            passwordHash: hash,
        });
        const user = await doc.save();
        const token = jwt.sign({
                _id: user._id,
            }, 'secret123',
            {
                expiresIn: '7d'
            }
        );

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Can`t register'
        })
    }

})


app.listen(PORT, (err) => {


    if (err) {
        return console.log(err)
    }

    console.log(`App listen on ${PORT} `)
})