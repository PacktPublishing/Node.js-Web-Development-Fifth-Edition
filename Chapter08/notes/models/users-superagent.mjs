import { default as request } from 'superagent';
import util from 'util';
import DBG from 'debug';
const debug = DBG('notes:users-superagent'); 
const error = DBG('notes:error-superagent');

import { default as bcrypt } from 'bcrypt';
const saltRounds = 10;

var authid = 'them';
var authcode = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';
 
function reqURL(path) {
    const requrl = new URL(process.env.USER_SERVICE_URL);
    requrl.pathname = path;
    return requrl.toString();
}

async function hashpass(password) {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashed = await bcrypt.hash(password, salt);
    return hashed;
}

export async function create(username, password,
    provider, familyName, givenName, middleName,
    emails, photos) {
    var res = await request
        .post(reqURL('/create-user'))
        .send({
            username, password: await hashpass(password), provider,
            familyName, givenName, middleName, emails, photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function update(username, password,
    provider, familyName, givenName, middleName,
    emails, photos) {
    var res = await request
        .post(reqURL(`/update-user/${username}`))
        .send({
            username, password: await hashpass(password), provider,
            familyName, givenName, middleName, emails, photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function find(username) {
    var res = await request
        .get(reqURL(`/find/${username}`))
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function userPasswordCheck(username, password) {
    var res = await request
        .post(reqURL(`/password-check`))
        .send({ username, password })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function findOrCreate(profile) {
    var res = await request
        .post(reqURL('/find-or-create'))
        .send({
            username: profile.id,
            password: await hashpass(profile.password),
            provider: profile.provider,
            familyName: profile.familyName,
            givenName: profile.givenName,
            middleName: profile.middleName,
            emails: profile.emails, photos: profile.photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}

export async function listUsers() {
    var res = await request
        .get(reqURL('/list'))
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth(authid, authcode);
    return res.body;
}
