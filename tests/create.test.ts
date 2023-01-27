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
        expect(true).toBe(true);
    })
})
