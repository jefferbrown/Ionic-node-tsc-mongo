import express, { Application } from 'express';


export default class Server {

    public app: Application;
    public port: number = 3000

    constructor() {
        this.app = express()
    }



    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor en puerto ' + this.port);

        })
    }



}