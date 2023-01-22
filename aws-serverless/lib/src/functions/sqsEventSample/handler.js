import middy from "@middy/core";
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
const logger = new Logger({ serviceName: 'sqsEventSample' });
export const sqsEventSample = async (_event, _context) => {
    logger.info('inputData', { data: _event.Records });
};
export const main = middy(sqsEventSample)
    .use(injectLambdaContext(logger, { logEvent: true }));
//# sourceMappingURL=handler.js.map