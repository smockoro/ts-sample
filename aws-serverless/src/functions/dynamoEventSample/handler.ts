import middy from "@middy/core"
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { DynamoDBStreamEvent, Context } from 'aws-lambda';

const logger = new Logger({ serviceName: 'dynamoEventSample' });

export const dynamoEventSample = async (_event: DynamoDBStreamEvent, _context: Context): Promise<void> => {
  logger.info('inputData', {data: _event.Records})
};

export const main = middy(dynamoEventSample)
  .use(injectLambdaContext(logger, { logEvent: true }));
