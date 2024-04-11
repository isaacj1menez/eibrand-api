/* Core modules */

/* Third Party dependencies */
import 'reflect-metadata';
import { fixModuleAlias } from './utils/fix-module-alias'; // * Fix the alias '@' defined in tsconfig.json to be used by Javascript
import express, { Application } from 'express';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers'; // * Create controller classes with methods as REST actions
import { Server } from 'socket.io';
import { SocketControllers } from 'socket-controllers'; // * Use classes controllers to handle websocket events
import { Container } from 'typedi'; // * Dependency inyection features
import { DataSource } from 'typeorm'; // * ORM
import { registerController, useContainer as cronUseContainer } from 'cron-decorators';
import { loadEventDispatcher } from './utils/load-event-dispatcher';
import bodyparser from 'body-parser';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';

/* Configurations */
fixModuleAlias(__dirname);

/* Local modules */
import { appConfig } from '@base/config/app';
import { AppDataSource } from './database/data-source';
import { loadHelmet } from './utils/load-helmet';

export class App {
    private app: Application = express();
    private port: Number = appConfig.port;

    constructor() {
        this.init();
    } 
    
    public init = async () => {
        this.userContainers();
        await this.initDataBase();
        await this.registerEvents();
        this.registerCronJobs();
        this.socketControllers();
        this.routingControllers();
    }

    private initDataBase = async () => {
        const dataBase: DataSource = AppDataSource;
        try {
            await dataBase.initialize();
        } catch (error) {
            console.log('Caught! Cannot connect to database: ' + error);
        }
    }

    private registerEvents = async () => {
        await loadEventDispatcher();
    }

    private registerCronJobs = () => {
        if(!appConfig.cronJobsEnabled) {
            return false;
        }

        registerController([__dirname + appConfig.cronJobsDir]);
    }

    private setupMiddlewares() {
        this.app.use(bodyparser.urlencoded({ extended: true}));
        this.app.use(bodyparser.json());
        loadHelmet(this.app);
    }

    private userContainers = () => {
        useContainer(Container);
        cronUseContainer(Container);
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

    private setupSwagger = () => {
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas'
        });

        const storage = getMetadataArgsStorage();
        const spec = routingControllersToSpec(
            storage,
            { routePrefix: appConfig.routePrefix },
            {
                
            }
        )
    }
}

new App();