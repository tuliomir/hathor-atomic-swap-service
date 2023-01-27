import { closeDbConnection, getDbConnection } from "../src/libs/db";
import { cleanDatabase } from "./utils";

const mySql = getDbConnection();

describe('create a proposal', () => {

    beforeEach(async () => {
        await cleanDatabase(mySql);
    })

    afterAll(async () => {
        await closeDbConnection(mySql);
    })

    it('should reject for missing mandatory parameters', async () => {
        await expect({
            url: 'http://localhost:3001/dev/',
            method: 'POST',
            data: { } /* optional body parameters */,
            headers: { Authorization: 'Bearer token_value' } /* optional headers */,
        }).toReturnResponse(expect.objectContaining({
            data: expect.objectContaining({
                errorMessage: "Request body validation failed: requires property \"partialTx\", requires property \"authPassword\"",
            }),
            statusCode: 400,
        }));
    })
})
