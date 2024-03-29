import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import schema from "./schema";
import { middyfy } from "@libs/lambda";
import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";
import { ulid } from "ulid";
import { DynamoDB } from "aws-sdk";
import { Context } from "aws-lambda";
import { Tracer, captureLambdaHandler } from "@aws-lambda-powertools/tracer";

const serviceName = "createUserApi";
const logger = new Logger({ serviceName: serviceName });
const tracer = new Tracer({
  serviceName: serviceName,
});

const TableName = process.env.TABEL_NAME || "users";
const dynamo = tracer.captureAWSClient(
  new DynamoDB({
    //region: 'ap-northeast-1',
    //endpoint: 'http://localhost:8000',
    //accessKeyId: 'DEFAULT_ACCESS_KEY',
    //secretAccessKey: 'DEFAULT_SECRET'
  })
);

export class User {
  id: string;
  name: string;
  age: number;
  email: string;

  constructor(id: string, name: string, age: number, email: string) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.email = email;
  }
}

export const createUserApi: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (_event, _context: Context) => {
  const user = new User(ulid(), _event.body.name, 22, _event.body.email);

  logger.info("user", { user });

  const params: DynamoDB.PutItemInput = {
    TableName: TableName,
    Item: {
      id: { S: user.id },
      name: { S: user.name },
      age: { N: user.age.toString() },
      email: { S: user.email },
    },
  };

  try {
    const res = await dynamo.putItem(params).promise();
    if (res.$response.error) {
      logger.error("error occer", { error: res.$response.error });
    }
    logger.info("success", { data: res.$response.data });
    return formatJSONResponse({
      user,
    });
  } catch (e) {
    logger.error("error occuer", { error: e });
    return formatJSONResponse({
      e,
    });
  }
};

export const main = middyfy(createUserApi)
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(captureLambdaHandler(tracer));
