/* Core modules */

/* Third Party dependencies */
import 'reflect-metadata';
import express, { Application } from 'express';
import { useExpressServer } from 'routing-controllers';
import { Server } from 'socket.io';
import { SocketControllers } from 'socket-controllers';
import { Container } from 'typedi';

/* Local modules */
import { appConfig } from '@base/config/app';

export class App {
    private app: Application = express();
    private port: Number = appConfig.port;

    public init = () => {
        this.socketControllers();
        this.routingControllers();
    }

    private routingControllers = () => {
        console.log([__dirname + appConfig.controllersDir]);
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
        
        new SocketControllers({
            io,
            container: Container,
            controllers: [__dirname + appConfig.controllersDir],
        })
    }
}

new App();