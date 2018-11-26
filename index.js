'use strict';
// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');

// const EbucoreReader = require('services/ebucore_reader');
// const { VideoManifest } = require('services/manifest_writer');

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json({ strict: false, limit: '10mb' }));

app.post('/gmdm', (req, res) => {
  let bucketname = '947488465802-us-west-1-gmdm-test';
  let s3 = new AWS.S3();
  let params = {
    Bucket: bucketname,
    Key: `${req.body.id}.json`,
    Body: JSON.stringify(req.body),
    ACL: "bucket-owner-full-control",
  };

  s3.upload(params, (err, data) => {
    console.log('uploading....');
    console.log('writing to s3....');
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(data.Location);
    }
  });
});

// Get User endpoint
app.get('/', function(req, res) {
  res.send({msg: 'You are in sidecar project!!!!'});
  // res.send('We are in sidecar world!');
});

app.get('/users/:userId', function(req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const {userId, name} = result.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Create User endpoint
app.post('/users', function(req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ userId, name });
  });
});

 app.listen(65000, () => console.log('running on port 65000'));


module.exports.handler = serverless(app);
