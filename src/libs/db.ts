import serverlessMysql, {ServerlessMysql} from 'serverless-mysql';
require('dotenv').config();

// @ts-ignore
/**
 * Get a database connection.
 *
 * @returns The database connection
 */
export const getDbConnection = (): ServerlessMysql => (
    serverlessMysql({
        library: require('mysql2'),
        config: {
            host: '127.0.0.1',
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            port: 3306,
            password: process.env.DB_PASSWORD,
        },
        // TODO: Get this information from the dotEnv before trying production data
        // config: {
        //     host: process.env.DB_ENDPOINT,
        //     database: process.env.DB_NAME,
        //     user: process.env.DB_USER,
        //     port: parseInt(process.env.DB_PORT, 10),
        //     password: process.env.DB_PASS,
        // },
    })
);

export const closeDbConnection = async (mysql: ServerlessMysql): Promise<void> => {
    if (process.env.STAGE === 'local') {
        /*
         mysql.end() leaves the function hanging in the local environment. Some issues:
         https://github.com/jeremydaly/serverless-mysql/issues/61
         https://github.com/jeremydaly/serverless-mysql/issues/79

         It seems that's the expected behavior for local environment:
         https://github.com/serverless/serverless/issues/470#issuecomment-205372006
        */
        await mysql.quit();
    } else {
        await mysql.end();
    }
};
