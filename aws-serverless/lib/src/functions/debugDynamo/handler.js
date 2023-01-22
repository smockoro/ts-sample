import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { ulid } from 'ulid';
import { User } from '../../domain/model/user';
import { DynamoDB } from 'aws-sdk';
const logger = new Logger({ serviceName: 'debugDynamoDB' });
const TableName = process.env.TABEL_NAME || 'users';
const dynamo = new DynamoDB({
    region: 'ap-northeast-1',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
});
export const debugDynamoDB = async (_event, _context) => {
    const user = new User(ulid(), _event.body.name, 22, _event.body.email);
    const params = {
        TableName: TableName,
        Item: {
            'id': { S: user.id },
            'name': { S: user.name },
            'age': { N: user.age.toString() },
            'email': { S: user.email },
        },
    };
    try {
        const res = await dynamo.putItem(params).promise();
        if (res.$response.error) {
            logger.error('error occer', { error: res.$response.error });
        }
        logger.info('success', { data: res.$response.data });
        return formatJSONResponse({
            user,
        });
    }
    catch (e) {
        logger.error('error occuer', { error: e });
        return formatJSONResponse({
            e
        });
    }
};
export const main = middyfy(debugDynamoDB)
    .use(injectLambdaContext(logger, { logEvent: true }));
//# sourceMappingURL=handler.js.map