import middy from "@middy/core"
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import {
  DynamoDBStreamEvent,
  DynamoDBBatchResponse,
  Context,
} from 'aws-lambda';
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';

const serviceName = 'createUserApi'
const logger = new Logger({ serviceName: serviceName });
const tracer = new Tracer({
  serviceName: serviceName,
});

export const dynamoEventSample =
    async (_event: DynamoDBStreamEvent, _context: Context): Promise<void | DynamoDBBatchResponse> => {
  logger.info('inputData', {data: _event.Records});
  const res: DynamoDBBatchResponse = {
    batchItemFailures: [],
  };
  return res;
};

export const main = middy(dynamoEventSample)
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(captureLambdaHandler(tracer));
