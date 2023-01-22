import hello from '@functions/hello';
import createUser from '@functions/createUser';
import debugDynamo from '@functions/debugDynamo';
const serverlessConfiguration = {
    service: 'aws-serverless',
    frameworkVersion: '3',
    plugins: [
        'serverless-esbuild',
        'serverless-dynamodb-local',
        'serverless-offline'
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: { hello, createUser, debugDynamo },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
        dynamodb: {
            stages: ['dev'],
            start: {
                port: 8000,
                inMemory: true,
                migrate: true,
                seed: true,
                convertEmptyValues: true,
            },
            seed: {
                user: {
                    sources: [
                        {
                            table: 'users',
                            sources: [
                                './.local-dynamodb/seeds/user.json',
                            ],
                        },
                    ],
                },
            },
        },
    },
    resources: {
        Resources: {
            users: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: 'users',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'S',
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH',
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
        },
    },
};
module.exports = serverlessConfiguration;
//# sourceMappingURL=serverless.js.map