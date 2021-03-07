import Server from "./classes/server";
import userRoutes from "./routes/usuario";
import postRouters from "./routes/post";

import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const server = new Server()

server.app.use(bodyParser.urlencoded({ extended: true }))
server.app.use(bodyParser.json())


//FileUpload
server.app.use(fileUpload({ useTempFiles: true }));

//config cors
server.app.use(cors({ origin: true, credentials: true }))


server.app.use('/user', userRoutes)
server.app.use('/post', postRouters)

//DB
mongoose.connect(
    'mongodb+srv://user_node:gmIdrqda1xCgqgLy@cluster0.xfxr8.mongodb.net/test',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err) => {
        if (err) {
            throw err;
        } else {
            console.log("DB online");
        }
    }
)
server.listen()

/*
user: user_node
password: gmIdrqda1xCgqgLy
*/