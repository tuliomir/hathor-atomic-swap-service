import middy, { MiddlewareObj } from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { closeDbConnection, getDbConnection } from '@libs/db';
import { ApiError, LambdaError, STATUS_CODE_TABLE } from '@libs/errors';

const mySql = getDbConnection();

export const middyfy = (handler) => middy(handler)
  .use(middyJsonBodyParser())
  .use(globalErrorHandler());

const globalErrorHandler = () : MiddlewareObj => ({
  // Adds the MySQL connection to the handler context
  before: async (request) => {
    request.event.mySql = await mySql;
  },
  // Closes the connection of the handler context
  after: async (request) => {
    await closeDbConnection(request.event.mySql);
  },
  onError: async (request) => {
    await closeDbConnection(request.event.mySql);
    let errorObj = request.error as LambdaError;
    if (!errorObj || !errorObj.message) {
      errorObj = new LambdaError(`Untreated error: ${errorObj}`);
    }

    const errorBody = {
      code: errorObj.code || ApiError.UNKNOWN_ERROR,
      errorMessage: errorObj.message,
      stack: errorObj.stack, // TODO: Remove this from production, only on dev
    };
    return {
      statusCode: STATUS_CODE_TABLE[errorObj.code] || 500,
      body: JSON.stringify(errorBody),
    };
  },
});
