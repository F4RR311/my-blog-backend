import express from 'express';
import mongoose from "mongoose";
const PORT = 3100;
import jwt from 'jsonwebtoken'

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.kafjq9l.mongodb.net/?retryWrites=true&w=majority'
).then(()=>{
    console.log('DB OK')
}).catch((err)=>{
    console.log('DB Error',err)
});
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
})

app.post('/auth/login', (req, res) => {

    const token = jwt.sign(
        {
            email: req.body.email,
            fullName:  req.body.fullName
        },
        'secret-123'
    );
    res.json({
        success: true,
        token,
    })

})



app.listen(PORT, (err) => {

    if (err) {
        return console.log(err)
    }

    console.log(`App listen on ${PORT} `)
})