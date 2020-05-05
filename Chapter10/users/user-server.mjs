import restify from 'restify';
import * as util from 'util';
import {
    SQUser, connectDB, userParams, findOneUser,
    createUser, sanitizedUser
} from './users-sequelize.mjs';

import DBG from 'debug';
const log = DBG('users:service'); 
const error = DBG('users:error'); 

import { default as bcrypt } from 'bcrypt';

///////////// Set up the REST server

var server = restify.createServer({
    name: "User-Auth-Service",
    version: "0.0.1"
});

server.use(restify.plugins.authorizationParser());
server.use(check);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

server.listen(process.env.PORT,
    process.env.REST_LISTEN ? process.env.REST_LISTEN : "localhost",
    function() {
  log(server.name +' listening at '+ server.url);
});

process.on('uncaughtException', function(err) { 
    console.error("UNCAUGHT EXCEPTION - "+ (err.stack || err));
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.error(`UNHANDLED PROMISE REJECTION: ${util.inspect(p)} reason: ${reason}`);
    process.exit(1);
});

//////////// REST server route handlers

// Create a user record
server.post('/create-user', async (req, res, next) => {
    try {
        log('create-user params '+ util.inspect(req.params));
        await connectDB();
        let result = await createUser(req);
        log('created '+ util.inspect(result));
        res.contentType = 'json';
        res.send(result);
        next(false);
    } catch(err) {
        res.send(500, err);
        error(`/create-user ${err.stack}`);
        next(false);
    }
});

// Update an existing user record
server.post('/update-user/:username', async (req, res, next) => {
    try {
        log(`update-user params ${util.inspect(req.params)}`);
        await connectDB();
        let toupdate = userParams(req);
        log(`updating ${util.inspect(toupdate)}`);
        await SQUser.update(toupdate, { where: { username: req.params.username }});
        const result = await findOneUser(req.params.username);
        log('updated '+ util.inspect(result));
        res.contentType = 'json';
        res.send(result);
        next(false);
    } catch(err) {
        res.send(500, err);
        error(`/update-user/${req.params.username} ${err.stack}`);
        next(false);
    }
});

// Find a user, if not found create one given profile information
server.post('/find-or-create', async (req, res, next) => {
    log('find-or-create '+ util.inspect(req.params));
    try {
        await connectDB();
        let user = await findOneUser(req.params.username);
        if (!user) {
            user = await createUser(req);
            if (!user) throw new Error('No user created');
        }
        log('find-or-created '+ util.inspect(user));
        res.contentType = 'json';
        res.send(user);
        return next(false);
    } catch(err) {
        res.send(500, err);
        error(`/find-or-create ${err.stack}`);
        next(false);
    }
});

// Find the user data (does not return password)
server.get('/find/:username', async (req, res, next) => {
    try {
        await connectDB();
        const user = await findOneUser(req.params.username);
        if (!user) {
            res.send(404, new Error("Did not find "+ req.params.username));
        } else {
            res.contentType = 'json';
            res.send(user);
        }
        next(false);
    } catch(err) {
        res.send(500, err);
        error(`/find/${req.params.username} ${err.stack}`);
        next(false);
    }
});

// Delete/destroy a user record
server.del('/destroy/:username', async (req, res, next) => {
    try {
        await connectDB();
        const user = await SQUser.findOne({ where: { username: req.params.username } });
        if (!user) {
            res.send(404,
                new Error(`Did not find requested ${req.params.username} to delete`));
        } else {
            user.destroy();
            res.contentType = 'json';
            res.send({});
        }
        next(false); 
    } catch(err) {
        res.send(500, err);
        error(`/destroy/${req.params.username} ${err.stack}`);
        next(false);
    }
});

// Check password
server.post('/password-check', async (req, res, next) => {
    log(`passwordCheck ${util.inspect(req.params)}`);
    try {
        await connectDB();
        const user = await SQUser.findOne({ where: { username: req.params.username } });
        log(`userPasswordCheck query=${req.params.username} ${req.params.password} user=${user.username} ${user.password}`);
        let checked;
        if (!user) {
            checked = { 
                check: false, username: req.params.username, 
                message: "Could not find user" 
            };
        } else {
            let pwcheck = false;
            if (user.username === req.params.username) {
                pwcheck = await bcrypt.compare(req.params.password, user.password);
            }
            if (pwcheck) {
                checked = { check: true, username: user.username };
            } else {
                checked = { 
                    check: false, username: req.params.username,
                    message: "Incorrect username or password" 
                };
            }
        }
        log(`passwordCheck result=${util.inspect(checked)}`);
        res.contentType = 'json';
        res.send(checked);
        next(false); 
    } catch(err) {
        res.send(500, err);
        error(`/passwordCheck ${err.stack}`);
        next(false);
    }
});

// List users
server.get('/list', async (req, res, next) => {
    try {
        await connectDB();
        let userlist = await SQUser.findAll({});
        userlist = userlist.map(user => sanitizedUser(user));
        if (!userlist) userlist = [];
        log(util.inspect(userlist));
        res.contentType = 'json';
        res.send(userlist);
        next(false);
    } catch(err) {
        res.send(500, err);
        error(`/list ${err.stack}`);
        next(false);
    }
});

// Mimic API Key authentication.

var apiKeys = [ { user: 'them', key: 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF' } ];

function check(req, res, next) {
    log(`check ${util.inspect(req.authorization)}`);
    if (req.authorization && req.authorization.basic) {
        var found = false;
        for (let auth of apiKeys) {
            if (auth.key  === req.authorization.basic.password
             && auth.user === req.authorization.basic.username) {
                found = true;
                break;
            }
        }
        if (found) next();
        else {
            res.send(401, new Error("Not authenticated"));
            error('Failed authentication check '+ util.inspect(req.authorization));
            next(false);
        }
    } else {
        res.send(500, new Error('No Authorization Key'));
        error('NO AUTHORIZATION');
        next(false);
    }
}
