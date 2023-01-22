import middy from "@middy/core";
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
const logger = new Logger({ serviceName: 'dynamoEventSample' });
export const dynamoEventSample = async (_event, _context) => {
    logger.info('inputData', { data: _event.Records });
};
export const main = middy(dynamoEventSample)
    .use(injectLambdaContext(logger, { logEvent: true }));
//# sourceMappingURL=handler.js.map