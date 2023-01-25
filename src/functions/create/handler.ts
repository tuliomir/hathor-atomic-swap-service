import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ICreateProposalRequest } from '@models/create';
import createProposalSchema from './schema';

const create: ValidatedEventAPIGatewayProxyEvent<typeof createProposalSchema> = async (event) => {
  const {
    partialTx,
    authPassword,
  } = event.body as ICreateProposalRequest;

  console.log(`Received pass: ${authPassword}, tx: ${partialTx}`);

  return formatJSONResponse({
    message: `Password: ${authPassword}, tx length: ${partialTx.length}`,
    event,
  });
};

export const main = middyfy(create);
