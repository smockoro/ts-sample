import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { S3EventSource, S3EventSourceProps } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketEncryption, EventType, BucketAccessControl, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';

export class DebugS3EventLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // https://github.com/aws/aws-cdk/issues/9890
    // このStackをデプロイすると変なLambdaができるけど必要らしい

    const b = new Bucket(this, 'bucket-debug-s3-event', {
      bucketName: 'bucket-debug-s3-event',
      encryption: BucketEncryption.KMS_MANAGED,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    const r = new Role(this, 'role-debug-s3-event', {
      roleName: 'ROLE-DEBUG-S3-EVENT',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
      ]
    });

    const f = new Function(this, 'lambda-debug-s3-event', {
      role: r,
      functionName: 'LAMBDA-DEBUG-S3-EVENT',
      runtime: Runtime.NODEJS_16_X,
      handler: 'handler.main',
      timeout: Duration.seconds(60),
      environment: {
        TZ: "Asia/Tokyo",
      },
      code: AssetCode.fromAsset('../app/src/functions/debugS3Event/dist'),
    });

    const p: S3EventSourceProps = {
      events: [
        EventType.OBJECT_CREATED,
        EventType.OBJECT_TAGGING,
      ]
    }

    f.addEventSource(new S3EventSource(b, p));
  }
}
