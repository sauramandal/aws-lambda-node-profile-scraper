# aws-lambda-node-profile-scraper

## Deploying an Express.js app to AWS Lambda using the Serverless Framework

Functions-as-a-Service (FaaS) is a business model that lets you execute a piece of code and only charges you for the resources you use. As a developer, this means that you don't have to think about managing servers and scaling. You just focus on code.
There are several service providers who provide FaaS, such as Amazon Web Services Lambda, Google Cloud Functions, and Microsoft Azure Functions.
Now we will see how to deploy an Express.js application to the AWS Lambda function and we will use the Serverless Framework to automate our deployment process.

### Understand Serverless
- Create a simple Express application
- Convert the Express app to make it ready to deploy on the Lambda environment
- Set up Serverless Framework and deploy the application to AWS Lambda
- Finally, test our application

### What is Serverless?
Serverless is a cloud computing architecture where the application owner does not purchase, rent, manage, or provision the servers. Instead, the cloud partner manages the infrastructure side of things for the applications. The biggest advantage of this architecture is that provisioning of servers is done dynamically to meet the real-time computing demand.

Despite the name, serverless apps do not run without servers. It means that businesses don't need to manage the server side of things and instead, focus on front end development.

### Why use Serverless?
Cost-effective:

With a serverless architecture, you pay only for what you use. There is no idle capacity, no wasted resources, or money.

No Server Management:

Say goodbye to backend infrastructure management. No downtime, no provisioning or maintaining of servers ever again.

Virtually limitless scalability:

Scale only functions and not the application. Scaling up or down is as simple as executing a few lines of code.

High availability:

Extreme fault tolerance, which is made possible by multiple redundancies, is baked into the serverless architecture.

### Prerequisites
AWS account with access to IAM and Lambda.
Node.js 8  or later.
NPM
Create a simple Express application
We need an express application. Let's create a simple one.

```bash
mkdir sample-app && cd sample-app
npm init -y
npm install express
touch app.js
```

The following code goes to app.js

```javascript  
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/api/info', (req, res) => {
  res.send({ application: 'sample-app', version: '1.0' });
});
app.post('/api/v1/getback', (req, res) => {
  res.send({ ...req.body });
});
app.listen(3000, () => console.log(`Listening on: 3000`));
```

The above sample application exposes two API's

#### GET /api/info returns information about current API
#### POST /api/v1/getback returns the request body whatever we sent
Convert the express app to make it ready to deploy on Lambda environment
We need a serverless-http module which allows us to ‘wrap’ our express app for serverless use.

So let's install this module
```
npm i serverless-http
```

Let's update our app.js

```javascript  
const serverless = require('serverless-http');
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/api/info', (req, res) => {
  res.send({ application: 'sample-app', version: '1' });
});
app.post('/api/v1/getback', (req, res) => {
  res.send({ ...req.body });
});

module.exports.handler = serverless(app);
```

Our app is now ready to deploy on the Lambda environment. Let's continue with deployment.

Set up Serverless Framework and deploy the application to AWS Lambda
Deploying a serverless app manually using an API Gateway and AWS Lambda can be a tedious job. We should let tools do the heavy-lifting instead. One such tool is the Serverless Framework. Here is a step by step guide on how to use Serverless to deploy our app.

### To install Serverless, run the following command in terminal.

```  
npm install -g serverless
```
Verify that Serverless is installed successfully by running the following command in the terminal 
```
serverless --version
```

### Allow serverless to access our AWS account. Replace ACCESS_KEY and SECRET_KEY above with your AWS access and secret keys.

```
serverless config credentials --provider aws --key ACCESS_KEY --secret SECRET_KEY
```

### Next, let's create a Serverless framework config file on application folder:

```  
touch serverless.yml
```
The following code goes in serverless.yml

```
service: sample-app
provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: us-east-1
  memorySize: 128
functions:
  app:
    handler: app/app.handler
    events: 
      - http: 
          path: /
          method: ANY
          cors: true
      - http: 
          path: /{proxy+}
          method: ANY
          cors: true
```

### Now we are all set to deploy our application. Run the following command to deploy.
```
serverless deploy
```

### That's it. We've deployed an Express.js application to AWS Lambda and we used the Serverless Framework to automate the deployment process.
