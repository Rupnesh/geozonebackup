const express = require('express');
const bodyParser = require('body-parser');
const listen = require('./index.listen');
const swagger = require('./index.swagger');
const reactApp = require('./index.reactapp');
const { db, environment } = require('./config');
const sequelize = require('./sequelize');
const { apiVersion } = require('./config');
const endpoints = require('./endpoints');
const displayError = require('./services/displayError');
const app = express();
const router = express.Router();

 


sequelize(()=> {
  console.log('DB READY');
});
/**
 * Prevent server to crash when exception is thrown in production
 * */
if (environment === 'prod') {
  process.on('uncaughtException', (e) => displayError(e));
  process.on('unhandledRejection', (e) => displayError(e));
}

//console.log('process started 3');

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
  next();
});

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', '*  ');
//   res.header('Access-Control-Allow-Headers', '*');
//   next();
//   });

//Origin, X-Requested-With, Content-Type, Accept, x-auth-token
process.on('uncaughtException',(err)=>{
 // console.log('uncaughtexception', err);
  process.exit(1);
})   
process.on('unhandledRejection',(err)=>{
  //console.log('unhandledrejection');
  process.exit(1);
})
// process.on('error',(err)=>{
//  // console.log('unhandledrejection');
//   process.exit(1);
// })
// JSON Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup API routes for endpoints
endpoints(router, apiVersion); // load the v1 of the endpoints
app.use(`/${apiVersion}`, router);

// Initialize swagger
if (environment === 'local' || environment === 'dev') {
 // console.log('--- SWAGGER INIT ---');
  swagger(app);
}

// Initialize Server
listen(app);

// Initialize the app static expose
reactApp(app);
