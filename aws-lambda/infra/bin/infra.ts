#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { DebugSqsLambdaStack } from '../lib/sqs-stack';
import { DebugDynamoDBStreamEventLambdaStack } from '../lib/dynamodb-stack';
import { DebugS3EventLambdaStack } from '../lib/s3-stack';
import { CreateUserApiLambdaStack } from '../lib/create-user-api-lambda-stack';
import { FargateSampleStack } from '../lib/fargate-sample-stack';
import { FargateSampleVpcStack } from '../lib/fargate-sample-vpc-stack';
import { FargateSampleScheduledTaskStack } from '../lib/fargate-sample-scheduled-task-stack';

const app = new App();
/*
new InfraStack(app, 'InfraStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });

new DebugSqsLambdaStack(app, 'DebugSqsLambdaStack', {
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new DebugDynamoDBStreamEventLambdaStack(app, 'DebugDynamoDBStreamEventLambdaStack', {
})

new DebugS3EventLambdaStack(app, 'DebugS3EventLambdaStack', {
});

new CreateUserApiLambdaStack(app, 'CreateUserApiLambdaStack', {
});

new FargateSampleVpcStack(app, 'FargateSampleVpcStack', {
});

new FargateSampleStack(app, 'FargateSampleStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});

/*
new FargateSampleScheduledTaskStack(app, 'FargateSampleScheduledStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
})
*/

app.synth()
