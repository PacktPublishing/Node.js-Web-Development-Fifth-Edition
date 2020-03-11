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
        const yamltext = fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf8');
        const params = jsyaml.safeLoad(yamltext, 'utf8');
        debug(`connectDB ${util.inspect(params)}`);
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