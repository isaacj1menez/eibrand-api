/* Core modules */

/* Third Party dependencies */
import 'reflect-metadata';
import { fixModuleAlias } from './utils/fix-module-alias'; // * Fix the alias '@' defined in tsconfig.json to be used by Javascript
import express, { Application } from 'express';
import { useExpressServer, useContainer } from 'routing-controllers'; // * Create controller classes with methods as REST actions
import { Server } from 'socket.io';
import { SocketControllers } from 'socket-controllers'; // * Use classes controllers to handle websocket events
import { Container } from 'typedi'; // * Dependenci inyection features

/* Configurations */
fixModuleAlias(__dirname);

/* Local modules */
import { appConfig } from '@base/config/app';

export class App {
    private app: Application = express();
    private port: Number = appConfig.port;

    constructor(){
        this.userContainers();
        this.init();
    } 

    public init = () => {
        this.socketControllers();
        this.routingControllers();
    }

    private userContainers = () => {
        useContainer(Container);
    }

    private routingControllers = () => {
        useExpressServer(this.app, {
            validation: { stopAtFirstError: true },
            cors: true,
            classTransformer: true,
            defaultErrorHandler: false,
            routePrefix: '/api',
            controllers: [__dirname + appConfig.controllersDir],
        });
    }

    private socketControllers = () => {
        const server = require('http').Server(this.app);
        const io = new Server(server);

        server.listen(this.port, () => console.log(`🚀 Server started at http://localhost:${this.port}\n🚨️ Environment: ${process.env.NODE_ENV}`));

        this.app.use((req: any, res: any, next: express.NextFunction) => {
            next();
        });
        
        new SocketControllers({
            io,
            container: Container,
            controllers: [__dirname + appConfig.controllersDir],
        })
    }
}

new App();