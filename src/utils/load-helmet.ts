import Helmet from 'helmet';
import express from 'express';

export const loadHelmet = (app: express.Application) => {
    return app.use(
      Helmet({
        /**
         * Default helmet policy + own customizations - graphiql support
         * https://helmetjs.github.io/
         */
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [
              "'self'",
              /** @by-us - adds graphiql support over helmet's default CSP */
              "'unsafe-inline'",
            ],
            baseUri: ["'self'"],
            blockAllMixedContent: [],
            fontSrc: ["'self'", 'https:', 'data:'],
            frameAncestors: ["'self'"],
            imgSrc: ["'self'", 'raw.githubusercontent.com', 'data:'],
            styleSrc: ["'self'", 'unpkg.com'],
            objectSrc: ["'none'"],
            scriptSrc: [
              "'self'",
              /** @by-us - adds graphiql support over helmet's default CSP */
              "'unsafe-inline'",
              /** @by-us - adds graphiql support over helmet's default CSP */
              "'unsafe-eval'",
              'unpkg.com',
            ],
            upgradeInsecureRequests: [],
          },
        },
      }),
    );
  }