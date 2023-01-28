import { closeDbConnection, getDbConnection } from "@libs/db";
import { cleanDatabase, generateApiEvent, generateHandlerContext } from "../utils";
import { main as create } from "@functions/create/handler";
import * as service from "@functions/create/service";

const mySql = getDbConnection();

const dbMethodSpy = jest.spyOn(service, 'createProposalOnDb');

describe('create a proposal', () => {

    beforeEach(async () => {
        await cleanDatabase(mySql);
    })

    afterAll(async () => {
        await closeDbConnection(mySql);
    })

    it('should reject for an invalid password', async () => {
        const event = generateApiEvent();
        const context = generateHandlerContext();

        event['body'].authPassword = 'ab';

        // The type checker does not recognize the event type correctly
        // @ts-ignore
        const response = await create(event, context)
        expect(response.statusCode).toStrictEqual(400);
        expect(JSON.parse(response.body))
            .toStrictEqual(expect.objectContaining({
                code: 'invalid-password',
                errorMessage: "Invalid password",
            }));
    })

    it('should treat the response for a db failure', async () => {
        const event = generateApiEvent();
        const context = generateHandlerContext();

        event['body'].authPassword = 'abc';

        // Mock
        dbMethodSpy.mockImplementationOnce(() => {
            throw new Error('Random failure');
        })

        // The type checker does not recognize the event type correctly
        // @ts-ignore
        const response = await create(event, context)
        expect(response.statusCode).toStrictEqual(500);
        expect(JSON.parse(response.body))
            .toStrictEqual(expect.objectContaining({
                code: 'unknown-error',
                errorMessage: 'Random failure',
            }));
    })

    it('should treat the response for a badly formatted code error', async () => {
        const event = generateApiEvent();
        const context = generateHandlerContext();

        event['body'].authPassword = 'abc';

        // Mock
        dbMethodSpy.mockImplementationOnce(() => {
            throw 'Badly formatted failure';
        })

        // The type checker does not recognize the event type correctly
        // @ts-ignore
        const response = await create(event, context)
        expect(response.statusCode).toStrictEqual(500);
        expect(JSON.parse(response.body))
            .toStrictEqual(expect.objectContaining({
                code: 'unknown-error',
                errorMessage: 'Untreated error: Badly formatted failure',
            }));
    })

    it('should return the uuid of the created proposal', async () => {
        const event = generateApiEvent();
        const context = generateHandlerContext();

        event['body'].partialTx = 'abc';
        event['body'].authPassword = 'abc';

        // The type checker does not recognize the event type correctly
        // @ts-ignore
        const response = await create(event, context)
        expect(response.statusCode).toStrictEqual(200);
        let body = JSON.parse(response.body);

        expect(body)
            .toStrictEqual(expect.objectContaining({
                success: true,
                id: expect.any(String),
            }));
        expect(body.id).toHaveLength(36);
    })
})
