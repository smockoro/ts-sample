import { dynamoEventSample } from '../../../functions/dynamoEventSample/handler';
import { dummyContext } from '../__utils__/util';
describe('handler test', () => {
    test('sample test1', async () => {
        const e = {
            Records: [
                {
                    awsRegion: 'ap-northeast-1',
                    eventName: 'INSERT',
                },
            ],
        };
        dynamoEventSample(e, dummyContext);
    });
});
//# sourceMappingURL=handler.test.js.map