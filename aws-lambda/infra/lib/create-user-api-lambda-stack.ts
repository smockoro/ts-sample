import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, AssetCode, StartingPosition, Tracing } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class CreateUserApiLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const r = new Role(this, 'role-create-user-api', {
      roleName: 'ROLE-CREATE-USER-API',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AWSXrayFullAccess'),
      ]
    });

    const f = new Function(this, 'lambda-create-user-api', {
      role: r,
      functionName: 'LAMBDA-CREATE-USER-API',
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler.main',
      timeout: Duration.seconds(60),
      environment: {
        TZ: "Asia/Tokyo",
      },
      code: AssetCode.fromAsset('../app/src/functions/createUserApi/dist'),
      tracing: Tracing.ACTIVE,
    });

    const ag = new RestApi(this, 'apigateway-user', {
      restApiName: 'apigateway-user',
      deployOptions: {
        stageName: 'v1',
        tracingEnabled: true,
      },
    });
    const k = ag.addApiKey("sampleKey", {
      apiKeyName: "sample-api-key",
    });
    const up = ag.addUsagePlan("sampleApiUsagePlan");
    up.addApiKey(k);
    up.addApiStage({stage: ag.deploymentStage});

    const usersResource = ag.root.addResource('users');
    usersResource.addMethod(
      'POST',
      new LambdaIntegration(
        f, { proxy: true },
      )
    );

  }
}
