import middy from "@middy/core"
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { SQSEvent, Context } from 'aws-lambda';

const logger = new Logger({ serviceName: 'sqsEventSample' });

export const sqsEventSample = async (_event: SQSEvent, _context: Context): Promise<void> => {
  logger.info('inputData', {data: _event.Records})
};

export const main = middy(sqsEventSample)
  .use(injectLambdaContext(logger, { logEvent: true }));
