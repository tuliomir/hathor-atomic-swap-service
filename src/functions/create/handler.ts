import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ICreateProposalRequest } from '@models/create';
import createProposalSchema from './schema';
import { createProposalOnDb } from "@functions/create/service";
import { getDbConnection } from "@libs/db";
import { hashString } from "@libs/util";


const mySql = getDbConnection();

const create: ValidatedEventAPIGatewayProxyEvent<typeof createProposalSchema> = async (event) => {
    const {
        partialTx,
        authPassword,
    } = event.body as ICreateProposalRequest;
    const hashedPassword = hashString(authPassword);

    const { proposalId } = await createProposalOnDb(mySql,{
        partialTx,
        authPassword: hashedPassword,
    });

    return formatJSONResponse({
        success: true,
        id: proposalId,
    });
};

export const main = middyfy(create);
