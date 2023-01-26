import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ICreateProposalRequest } from '@models/create';
import createProposalSchema from './schema';
import { createProposalOnDb } from "@functions/create/service";
import { getDbConnection } from "@libs/db";


const mySql = getDbConnection();

const create: ValidatedEventAPIGatewayProxyEvent<typeof createProposalSchema> = async (event) => {
    const {
        partialTx,
        authPassword,
    } = event.body as ICreateProposalRequest;

    const { proposalId } = await createProposalOnDb(mySql,{partialTx, authPassword});

    return formatJSONResponse({
        success: true,
        id: proposalId,
    });
};

export const main = middyfy(create);
