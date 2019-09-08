const winston = require('winston');
const express = require('express');
const app = express();
const expressSwagger = require('express-swagger-generator')(app);
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const HOST_URL = process.env.HEROKU_URL || 'localhost:3000';
let options = {
    swaggerDefinition: {
        info: {
            description: 'Explane Api Documents',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: HOST_URL,
        basePath: '/api/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            bearerAuth: {
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
require('appmetrics-dash').attach();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//public folder 
app.use('/public', (req, res, next) => {
    var result = req.url.match(/^\/js\/(maps|src)\/.+\.js$/)
    if (result) {
        return res.status(403).end('403 Forbidden')
    }
    next()
  })
app.use('/public', express.static(path.join(__dirname, '/uploads')))


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;