import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, AssetCode, StartingPosition, Tracing } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Table, AttributeType, StreamViewType } from 'aws-cdk-lib/aws-dynamodb';

export class DebugDynamoDBStreamEventLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const t = new Table(this, 'table-debug-dynamodb-stream-event', {
      tableName: 'users',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const r = new Role(this, 'role-debug-dynamodb-stream-event', {
      roleName: 'ROLE-DEBUG-DYNAMODB-STREAM-EVENT',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AWSXrayFullAccess'),
      ]
    });

    const f = new Function(this, 'lambda-debug-dynamodb-stream-event', {
      role: r,
      functionName: 'LAMBDA-DEBUG-DYNAMODB-STREAM-EVENT',
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler.main',
      timeout: Duration.seconds(60),
      environment: {
        TZ: "Asia/Tokyo",
      },
      code: AssetCode.fromAsset('../app/src/functions/debugDynamoDBStreamEvent/dist'),
      tracing: Tracing.ACTIVE,
    });

    f.addEventSource(new DynamoEventSource(t, {
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 5,
      retryAttempts: 3,
    }))
  }
}
