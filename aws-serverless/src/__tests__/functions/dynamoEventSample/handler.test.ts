import { DynamoDBStreamEvent } from 'aws-lambda';
import { dynamoEventSample } from '../../../functions/dynamoEventSample/handler';
import { dummyContext } from '../__utils__/util';

describe('handler test', (): void => {
  test('sample test1', async () => {
    const e: DynamoDBStreamEvent =  {
      Records: [
        {
          awsRegion: 'ap-northeast-1',
          eventName: 'INSERT',
        },
      ],
    }
    dynamoEventSample(e, dummyContext)
  });
});
