import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { Function, Runtime, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';

// DebugSqsLambdaに必要なAWSスタックを定義
export class DebugSqsLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const q = new Queue(this, 'sqs-debug-sqs-event', {
      queueName: 'SQS-DEBUG-SQS-EVENT',
      visibilityTimeout: Duration.seconds(120),

      // https://github.com/aws/aws-cdk/issues/8550
      // fifo: false,
    });

    const r = new Role(this, 'role-debug-sqs-event', {
      roleName: 'ROLE-DEBUG-SQS-EVENT',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess'),
      ]
    });

    const f = new Function(this, 'lambda-debug-sqs-event', {
      role: r,
      functionName: 'LAMBDA-DEBUG-SQS-EVENT',
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler.main',
      timeout: Duration.seconds(60),
      environment: {
        TZ: "Asia/Tokyo",
      },
      code: AssetCode.fromAsset('../app/src/functions/debugSqsEvent/dist'),
    });

    f.addEventSource(new SqsEventSource(q));
  }
}
