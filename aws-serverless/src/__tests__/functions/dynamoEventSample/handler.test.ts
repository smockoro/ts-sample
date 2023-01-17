import { debugDynamoDB } from '../../../functions/debugDynamo/handler';
import { dummyContext } from '../__utils__/util';

describe('handler test', (): void => {
  test('sample test1', async () => {
    const e =  {
      body: {
        name: "alice",
        email: "a.user@example.com",
      },
    }
    debugDynamoDB(e, dummyContext)
  });
});
