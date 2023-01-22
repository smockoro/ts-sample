import { DynamoDBStreamEvent } from 'aws-lambda';
import { dynamoEventSample } from '../../../../src/functions/debugDynamoDBStreamEvent/handler';
import { dummyContext } from '../../__utils__/util';

describe('handler test', (): void => {
  test('sample test1', async () => {
    const e: DynamoDBStreamEvent =  {
      "Records":[
        {
          "eventID":"1",
          "eventName":"INSERT",
          "eventVersion":"1.0",
          "eventSource":"aws:dynamodb",
          "awsRegion":"us-east-1",
          "dynamodb":{
            "Keys":{
              "Id":{
                "N":"101"
              }
            },
            "NewImage":{
              "Message":{
                "S":"New item!"
              },
              "Id":{
                "N":"101"
              }
            },
            "SequenceNumber":"111",
            "SizeBytes":26,
            "StreamViewType":"NEW_AND_OLD_IMAGES"
          },
          "eventSourceARN":"stream-ARN"
        },
        {
          "eventID":"2",
          "eventName":"MODIFY",
          "eventVersion":"1.0",
          "eventSource":"aws:dynamodb",
          "awsRegion":"us-east-1",
          "dynamodb":{
            "Keys":{
              "Id":{
                "N":"101"
              }
            },
            "NewImage":{
              "Message":{
                "S":"This item has changed"
              },
              "Id":{
                "N":"101"
              }
            },
            "OldImage":{
              "Message":{
                "S":"New item!"
              },
              "Id":{
                "N":"101"
              }
            },
            "SequenceNumber":"222",
            "SizeBytes":59,
            "StreamViewType":"NEW_AND_OLD_IMAGES"
          },
          "eventSourceARN":"stream-ARN"
        },
        {
          "eventID":"3",
          "eventName":"REMOVE",
          "eventVersion":"1.0",
          "eventSource":"aws:dynamodb",
          "awsRegion":"us-east-1",
          "dynamodb":{
            "Keys":{
              "Id":{
                "N":"101"
              }
            },
            "OldImage":{
              "Message":{
                "S":"This item has changed"
              },
              "Id":{
                "N":"101"
              }
            },
            "SequenceNumber":"333",
            "SizeBytes":38,
            "StreamViewType":"NEW_AND_OLD_IMAGES"
          },
          "eventSourceARN":"stream-ARN"
        }
      ]
    }
    await dynamoEventSample(e, dummyContext);
  });
});

