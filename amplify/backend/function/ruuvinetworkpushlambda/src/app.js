/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "tags";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "tag";
const partitionKeyType = "S";
const sortKeyName = "timestamp";
const sortKeyType = "N";
const hasSortKey = sortKeyName !== "";
const path = "/post";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {

    /*for tag in body["gwmac"]["tags"].keys():
        item = body["gwmac"]["tags"][tag]
        item["tag"] = tag
        print(item)
        table.put_item(Item=item)*/
  let promises = [];
  console.log(req);
  let body = req.body;
  // TODO: Batch this write to avoid being throttled
  for(let i in body.gwmac.tags){
    let item = body.gwmac.tags[i];
    item.tag = i;
    let putItemParams = {
       TableName: tableName,
       Item: item
     }
    promises.push(dynamodb.put(putItemParams).promise());
  }
  Promise.all(promises).then((data) =>{
    res.json({success: 'post call succeed!', url: req.url, data: data.length});
  }).catch((err)=> {
    res.statusCode = 500;
    res.json({error: err, url: req.url, body: req.body});
  });
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
