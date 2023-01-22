import middy from "@middy/core"
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import {
  S3Event,
  Context,
} from 'aws-lambda';

const logger = new Logger({ serviceName: 's3EventSample' });

export const s3EventSample =
    async (_event: S3Event, _context: Context): Promise<void> => {
  logger.info('inputData', {data: _event.Records});
};

export const main = middy(s3EventSample)
  .use(injectLambdaContext(logger, { logEvent: true }));
