/* Core modules */

/* Third Party dependencies */
import 'reflect-metadata';
import { useExpressServer, useContainer, getMetadataArgsStorage } from 'routing-controllers'; // * Create controller classes with methods as REST actions
import { registerController, useContainer as cronUseContainer } from 'cron-decorators'; // * Decorators from cron jobs and DI integration
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'; // * Validation for classes and json parsing
import { routingControllersToSpec } from 'routing-controllers-openapi'; // * Converting controllers and paths in sagger documentation
import { createSchema, createYoga } from 'graphql-yoga'; // * To define schemas to be used in GraphQL
import { SocketControllers } from 'socket-controllers'; // * Use classes controllers to handle websocket events
import * as swaggerUiExpress from 'swagger-ui-express'; // * UI after swagger definitions
import express, { Application } from 'express'; // * Server to manage the http calls
import { DataSource } from 'typeorm'; // * ORM
import bodyparser from 'body-parser'; // * Middleware to parse the server responses.
import { Server } from 'socket.io'; // * Server to manage the socket events
import { Container } from 'typedi'; // * Dependency inyection features (General container)

/* Configurations */
import { fixModuleAlias } from './utils/fix-module-alias'; // * Fix the alias '@' defined in tsconfig.json to be used by Javascript
fixModuleAlias(__dirname);

/* Local modules */
import { loadEventDispatcher } from './utils/load-event-dispatcher'; // * To create and load all events
import { AppDataSource } from './database/data-source'; // * Database config
import { loadHelmet } from './utils/load-helmet'; // * Headers security
import { appConfig } from '@base/config/app'; // * Application configs

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
        this.setupMiddlewares();
        this.socketControllers();
        this.routingControllers();
        this.registerDefaultHomePage();
        this.setupSwagger();
        this.setupGraphQL();
    }

    private initDataBase = async () => {
        const dataBase: DataSource = AppDataSource;
        try {
            await dataBase.initialize();
        } catch (error) {
            console.log('Caught! Cannot connect to database: ' + error);
        }
    }

    private userContainers = () => {
        useContainer(Container);
        cronUseContainer(Container);
    }

    private setupMiddlewares() {
        this.app.use(bodyparser.urlencoded({ extended: true }));
        this.app.use(bodyparser.json());
        loadHelmet(this.app);
    }

    private registerDefaultHomePage = () => {
        this.app.get('/', (req, res) => {
            res.json({
                title: appConfig.name,
                mode: appConfig.node,
                date: new Date(),
            });
        });
    }

    private routingControllers = () => {
        useExpressServer(this.app, {
            validation: { stopAtFirstError: true },
            cors: true,
            classTransformer: true,
            defaultErrorHandler: false,
            routePrefix: '/api',
            controllers: [__dirname + appConfig.controllersDir],
            middlewares: [__dirname + appConfig.middlewaresDir]
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

    private registerEvents = async () => {
        await loadEventDispatcher();
    }

    private registerCronJobs = () => {
        if (appConfig.cronJobsEnabled === "false") {
            return;
        }

        registerController([__dirname + appConfig.cronJobsDir]);
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
                components: {
                    schemas,
                    securitySchemes: {
                        bearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT'
                        }
                    }
                },
                info: {
                    description: 'Welcome to the club!',
                    title: 'API Documentation',
                    version: '1.0.0',
                    contact: {
                        name: 'Josue Jimenez',
                        url: 'http://josuej1menez.net',
                        email: 'support@genesyst.com'
                    }
                }
            }
        );

        this.app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
    }

    private setupGraphQL = async () => {
        if (appConfig.graphqlEnabled === "false") {
            return;
        }

        const yoga = createYoga({
            schema: createSchema({
                typeDefs: `
                  type Query {
                    fullname: String
                  }
                `,
                resolvers: {
                    Query: {
                        fullname: () => 'fullname'
                    }
                }
            })
        });

        this.app.use(yoga.graphqlEndpoint, yoga)
    }
}

new App();