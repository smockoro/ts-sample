import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc, IpAddresses, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export const paramNameVpcId = '/vpc/ids/vpcid';

export class FargateSampleVpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    /*
    const newProps = props ?? { env: {
      account: '742967853267',
      region: 'ap-northeast-1',
    }}
    super(scope, id, newProps)
    */
    super(scope, id, props)

    const vpc = new Vpc(this, 'fargate-example-vpc', {
      ipAddresses: IpAddresses.cidr('10.1.0.0/16'),
      maxAzs: 2,
      subnetConfiguration: [
        { name: 'public', cidrMask: 24, subnetType: SubnetType.PUBLIC },
        { name: 'private', cidrMask: 24, subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        { name: 'isolated', cidrMask: 24, subnetType: SubnetType.PRIVATE_ISOLATED },
      ]
    });

    new StringParameter(this, "fargate-example-vpc-parameter", {
      parameterName: paramNameVpcId,
      // description
      stringValue: vpc.vpcId,
    });
  }
}
