import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { paramNameClusterArn } from './fargate-sample-stack';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

/**
 * AWS Fargateのサンプル(クラスタ作成)
 *
 * @remarks
 * Fargateのクラスタ管理。
 * VPCは別途作ります。
 *
 */
export class FargateSampleScheduledTaskStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const c = Cluster.fromClusterArn(this, 'fargate-example-cluster',
      StringParameter.valueForStringParameter(this, paramNameClusterArn)
    );

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
  }
}


