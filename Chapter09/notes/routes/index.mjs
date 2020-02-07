import * as util from 'util';
import { default as express } from 'express';
import { NotesStore as notes } from '../models/notes-store.mjs';
export const router = express.Router();
import { io } from '../app.mjs';
import DBG from 'debug';
const debug = DBG('notes:home'); 
const error = DBG('notes:error-home'); 

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        let notelist = await getKeyTitlesList();
        // console.log(util.inspect(notelist));
        res.render('index', {
            title: 'Notes', notelist: notelist,
            user: req.user ? req.user : undefined
        });
    } catch (err) {
        next(err);
    }
});

async function getKeyTitlesList() {
    const keylist = await notes.keylist();
    let keyPromises = keylist.map(key => {
        return notes.read(key);
    });
    return Promise.all(keyPromises);
};

const emitNoteTitles = async () => {
    const notelist = await getKeyTitlesList();
    const notes = notelist.map(note => {
        return { key: note.key, title: note.title }
    });
    debug(`socketio emitNoteTitles ${util.inspect(notes)}`);
    io.of('/home').emit('notetitles', { notelist: notes });
};

export function init() {
    io.of('/home').on('connect', socket => {
        debug('socketio connection on /home');
    });
    notes.on('notecreated', emitNoteTitles);
    notes.on('noteupdated',  emitNoteTitles);
    notes.on('notedestroyed', emitNoteTitles);
}

