import { ServerlessMysql } from "serverless-mysql";

export const cleanDatabase = async (mysql: ServerlessMysql): Promise<void> => {
    const TABLES = [
        'Proposals',
    ];
    await mysql.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of TABLES) {
        await mysql.query(`DELETE FROM ${table}`);
    }
    await mysql.query('SET FOREIGN_KEY_CHECKS = 1');
};
