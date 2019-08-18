const winston = require('winston');
const express = require('express');
const app = express();
const expressSwagger = require('express-swagger-generator')(app);
console.log("__dirname", __dirname);
let options = {
    swaggerDefinition: {
        info: {
            description: 'Explane Api Documents',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3000/api',
        basePath: '/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'x-auth-token',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routers/**/*.js'] //Path to the API handle folder
};
expressSwagger(options)


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;