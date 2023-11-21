import express, { Request, Response, ErrorRequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api';
import passport from 'passport';

dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.use(passport.initialize())

server.get('/ping', (req: Request, res: Response) => res.json({ pong: true }));

server.use(apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if(err.status) {
        console.log("Error 1 ", err.status)
        res.status(err.status)
    }else{
        console.log("Error 2", err)
        res.status(400)
    }
    if(err.message) {
        res.json({ error: err.message })
    }else{
        res.status(400); // Bad Request
        res.json({ error: "Ocorreu algum erro."})
    }
    
}
server.use(errorHandler);

server.listen(process.env.PORT);