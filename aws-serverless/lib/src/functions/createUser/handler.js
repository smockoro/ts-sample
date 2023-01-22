import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { ulid } from 'ulid';
import { User } from '../../domain/model/user';
const logger = new Logger({ serviceName: 'createUser' });
const createUser = async (_event, _context) => {
    const user = new User(ulid(), _event.body.name, 22, "a@example.com");
    return formatJSONResponse({
        user,
    });
};
export const main = middyfy(createUser)
    .use(injectLambdaContext(logger, { logEvent: true }));
//# sourceMappingURL=handler.js.map