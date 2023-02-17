import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Cluster, FargateService, ContainerImage, FargateTaskDefinition, LogDriver } from 'aws-cdk-lib/aws-ecs';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { paramNameVpcId } from './fargate-sample-vpc-stack';
import { Rule } from 'aws-cdk-lib/aws-events';
import { EcsTask } from 'aws-cdk-lib/aws-events-targets';
import { Bucket, BucketEncryption, BucketAccessControl, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';

export const paramNameClusterArn = '/ecs/cluster/arn'

/**
 * AWS Fargateのサンプル(クラスタ作成)
 *
 * @remarks
 * Fargateのクラスタ管理。
 * VPCは別途作ります。
 *
 */
export class FargateSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = Vpc.fromLookup(this, 'fargate-sample-vpc', {
      vpcId: StringParameter.valueFromLookup(this, paramNameVpcId),
    });

    /*
    const eter = new Role(this, 'ecs-task-exec-role', {
      roleName: 'ROLE-ECS-TASK-EXEC',
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ]
    });

    const estr = new Role(this, 'ecs-service-task-role', {
      roleName: 'ROLE-ECS-SERVICE-TASK',
    });

    const ftd = new FargateTaskDefinition(this, 'amazon-ecs-sample-task-def');
    ftd.addContainer('sampleApp', {
      image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 256,
    });

    const sftd = new FargateTaskDefinition(this, 'amazon-ecs-sample-shceduled-task-def');
    sftd.addContainer('sampleScheduledApp', {
        image: ContainerImage.fromRegistry('amazonlinux:2'),
        memoryLimitMiB: 512,
        command: ['sh', '-c', 'echo "this is scheduled task (`date`)"'],
    });
    */

    const c = new Cluster(this, 'fargate-example-cluster', {
      clusterName: 'ECS-CLUSTER-EX-FARGATE',
      vpc: vpc,
      // containerInsights: true,
    });

    new StringParameter(this, 'fargate-example-cluster-param', {
      parameterName: paramNameClusterArn,
      stringValue: c.clusterArn,
    });

    const sft = new ScheduledFargateTask(this, 'amazon-ecs-sample-scheduled-task', {
      schedule: Schedule.cron({
        minute: '1',
        hour: '*',
        day: '*',
        month: '*',
      }),
      cluster: c,
      scheduledFargateTaskImageOptions: {
        image: ContainerImage.fromRegistry('amazonlinux:2'),
        memoryLimitMiB: 512,
        //memoryLimitMiB: 256,
        command: ['sh', '-c', 'echo "this is scheduled task (`date`)"'],
      },
      //taskDefinition: sftd,
      desiredTaskCount: 1,
      subnetSelection: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
    });

    const eventTaskDef = new FargateTaskDefinition(this, 'ecs-sample-event-bridge-scheduled-task-def');
    eventTaskDef.addContainer('sampleEventBridgeScheduledApp', {
      image: ContainerImage.fromRegistry('amazonlinux:2'),
      memoryLimitMiB: 256,
      command: ['sh', '-c', 'echo "this is scheduled task (`date`)"'],
      logging: LogDriver.awsLogs({
        streamPrefix: 'FARGATE-SAMPLE'
      })
    });

    const rule = new Rule(this, 'ecs-sample-scheduled-event-bridge-task', {
      ruleName: 'RULE-EVENT-BRIDGE-EX-TASK',
      schedule: Schedule.rate(Duration.minutes(1)),
      targets: [
        new EcsTask({
          cluster: c,
          taskDefinition: eventTaskDef,
          subnetSelection: {
            subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          },
        }),
      ],
    });

    const b = new Bucket(this, 'bucket-debug-s3-event', {
      bucketName: 'bucket-debug-s3-event',
      encryption: BucketEncryption.KMS_MANAGED,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      eventBridgeEnabled: true,
    });

    const s3eventTaskDef = new FargateTaskDefinition(this, 'ecs-sample-s3-event-bridge-task-def');
    s3eventTaskDef.addContainer('sampleEventBridgeS3EventApp', {
      image: ContainerImage.fromRegistry('amazonlinux:2'),
      memoryLimitMiB: 256,
      command: ['sh', '-c', 'echo "this is s3 event task (`date`)"'],
      logging: LogDriver.awsLogs({
        streamPrefix: '/fargate-example-s3-event-task'
      }),
    });

    new Rule(this, 'ecs-sample-s3-event-bridge-task', {
      ruleName: 'RULE-S3-EVENT-BRIDGE-EX-TASK',
      eventPattern: {
        source: ["aws.s3"],
        resources: [
          b.bucketArn,
        ],
        detailType: ["Object Created"],
      },
      targets: [
        new EcsTask({
          cluster: c,
          taskDefinition: s3eventTaskDef,
          subnetSelection: {
            subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          }
        }),
      ],
    });

    /*
    const fsvc = new FargateService(this, 'sample-app-fargate-service', {
      cluster: c,
      serviceName: 'FSVC-SAMPLE-APP',
      taskDefinition: ftd,
      desiredCount: 1,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
    });
    */

  }
}

