import { promises as fs } from 'fs';
import { default as jsyaml } from 'js-yaml';
import Sequelize from 'sequelize';

import { default as DBG } from 'debug';
const debug = DBG('notes:seqlz');
const error = DBG('notes:error-seqlz');
import util from 'util';

var sequlz;

export function dbHandle() {
    if (sequlz) return sequlz;
    return sequlz;
}

export async function connectDB() {
    if (typeof sequlz === 'undefined') {
        const yamltext = await fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8');
        const params = await jsyaml.safeLoad(yamltext, 'utf8');
        if (typeof process.env.SEQUELIZE_DBNAME !== 'undefined'
                && process.env.SEQUELIZE_DBNAME !== '') {
            params.dbname = process.env.SEQUELIZE_DBNAME;
        }
        if (typeof process.env.SEQUELIZE_DBUSER !== 'undefined'
                && process.env.SEQUELIZE_DBUSER !== '') {
            params.username = process.env.SEQUELIZE_DBUSER;
        }
        if (typeof process.env.SEQUELIZE_DBPASSWD !== 'undefined'
                && process.env.SEQUELIZE_DBPASSWD !== '') {
            params.password = process.env.SEQUELIZE_DBPASSWD;
        }
        if (typeof process.env.SEQUELIZE_DBHOST !== 'undefined'
                && process.env.SEQUELIZE_DBHOST !== '') {
            params.params.host = process.env.SEQUELIZE_DBHOST;
        }
        if (typeof process.env.SEQUELIZE_DBPORT !== 'undefined'
                && process.env.SEQUELIZE_DBPORT !== '') {
            params.params.port = process.env.SEQUELIZE_DBPORT;
        }
        if (typeof process.env.SEQUELIZE_DBDIALECT !== 'undefined'
                && process.env.SEQUELIZE_DBDIALECT !== '') {
            params.params.dialect = process.env.SEQUELIZE_DBDIALECT;
        }
        debug(`connectDB dbname=${params.dbname} user=${params.username} host=${params.params.host} dialect=${params.params.dialect}`);
        // debug(`connectDB ${util.inspect(params)}`);
        sequlz = new Sequelize(params.dbname,
                        params.username, params.password,
                        params.params);
        debug(`connectDB connected`);
        await sequlz.authenticate();
        debug(`connectDB authenticated`);
    }
    return sequlz;
}

export async function close() {
    if (sequlz) sequlz.close();
    sequlz = undefined;
}