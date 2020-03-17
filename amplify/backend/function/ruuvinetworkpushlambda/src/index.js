const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  event.headers["Content-Type"]="application/json";
  awsServerlessExpress.proxy(server, event, context);
};
