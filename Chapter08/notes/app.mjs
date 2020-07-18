import { default as express } from 'express';
import { default as hbs } from 'hbs';
import * as path from 'path';
// import * as favicon from'serve-favicon';
import { default as logger } from 'morgan';
import { default as rfs } from 'rotating-file-stream';
import { default as DBG } from 'debug';
const debug = DBG('notes:debug'); 
const dbgerror = DBG('notes:error'); 
// import { default as capcon } from 'capture-console';
import { default as cookieParser } from 'cookie-parser';
import { default as bodyParser } from 'body-parser';
import * as http from 'http';
// import fs from 'fs';
import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;
import {
    normalizePort, onError, onListening, handle404, basicErrorHandler
} from './appsupport.mjs';

import dotenv from 'dotenv/config.js';

import { router as indexRouter } from './routes/index.mjs';
import { router as notesRouter }  from './routes/notes.mjs';
import { router as usersRouter, initPassport } from './routes/users.mjs';

import session from 'express-session';
// For compatible session store packages, see:
//      http://expressjs.com/en/resources/middleware/session.html#compatible-session-stores
// Uncomment this for session-file-store
import sessionFileStore from 'session-file-store';
const FileStore = sessionFileStore(session);
// Uncomment this for connect-loki
// import sessionLokiStore from 'connect-loki';
// const LokiStore = sessionLokiStore(session);
// Uncomment this for memorystore
// import sessionMemoryStore from 'memorystore';
// const MemoryStore = sessionMemoryStore(session);
export const sessionCookieName = 'notescookie.sid';

// capcon.startCapture(process.stdout, function (stdout) {
//    fs.appendFileSync('stdout.txt', stdout, 'utf8');
// });
//
// capcon.startCapture(process.stderr, function (stderr) {
//    fs.appendFileSync('stderr.txt', stderr, 'utf8');
// });

import { useModel as useNotesModel } from './models/notes-store.mjs';
useNotesModel(process.env.NOTES_MODEL ? process.env.NOTES_MODEL : "memory")
.then(store => { debug(`Using NotesStore ${store}`); })
.catch(error => { onError({ code: 'ENOTESSTORE', error }); });

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
    // immediate: true,
    stream: process.env.REQUEST_LOG_FILE ?
        rfs.createStream(process.env.REQUEST_LOG_FILE, {
            size:     '10M', // rotate every 10 MegaBytes written
            interval: '1d',  // rotate daily
            compress: 'gzip' // compress rotated files
        })
        : process.stdout
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    // Use the appropriate session store class
    // store: new MemoryStore({}),
    // store: new LokiStore({}),
    store: new FileStore({ path: "sessions" }),
    secret: 'keyboard mouse',
    resave: true,
    saveUninitialized: true,
    name: sessionCookieName
}));
initPassport(app);
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/assets/vendor/bootstrap', express.static(
//     path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
// app.use('/assets/vendor/bootstrap', express.static(
//     path.join(__dirname, 'theme', 'dist')));
app.use('/assets/vendor/bootstrap/js', express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/assets/vendor/bootstrap/css', express.static(
    path.join(__dirname, 'minty')));
app.use('/assets/vendor/jquery', express.static(
    path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/assets/vendor/popper.js', express.static(
    path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd')));
app.use('/assets/vendor/feather-icons', express.static(
    path.join(__dirname, 'node_modules', 'feather-icons', 'dist')));

// Router function lists
app.use('/', indexRouter);
app.use('/notes', notesRouter);
app.use('/users', usersRouter);

// error handlers
// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port);
server.on('request', (req, res) => {
    debug(`${new Date().toISOString()} request ${req.method} ${req.url}`);
});
server.on('error', onError);
server.on('listening', onListening);
