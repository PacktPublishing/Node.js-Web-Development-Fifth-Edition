import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import { approotdir } from '../approotdir.mjs';
import { Note, AbstractNotesStore } from './Notes.mjs';
import { default as DBG } from 'debug';
const debug = DBG('notes:notes-fs');
const error = DBG('notes:error-fs');

export default class FSNotesStore extends AbstractNotesStore {

    async close() {
    }

    async update(key, title, body) {
        let note = crupdate(key, title, body);
        this.emitUpdated(note);
        return note;
    }

    async create(key, title, body) {
        let note = crupdate(key, title, body);
        this.emitCreated(note);
        return note;
    }

    async read(key) {
        var notesdir = await notesDir();
        var thenote;
        thenote = await readJSON(notesdir, key);
        debug(`READ ${notesdir}/${key} ${util.inspect(thenote)}`); 
        return thenote; 
    }

    async destroy(key) {
        var notesdir = await notesDir();
        await fs.unlink(filePath(notesdir, key));
        this.emitDestroyed(key);
    }

    async keylist() {
        var notesdir = await notesDir();
        var filez = await fs.readdir(notesdir);
        if (!filez || typeof filez === 'undefined') filez = []; 
        debug(`keylist dir ${notesdir} files=${util.inspect(filez)}`); 
        var thenotes = filez.map(async fname => { 
            var key = path.basename(fname, '.json'); 
            debug(`About to READ ${key}`); 
            var thenote = await readJSON(notesdir, key);
            return thenote.key; 
        }); 
        return Promise.all(thenotes); 
    }

    async count() {
        var notesdir = await notesDir();
        var filez = await fs.readdir(notesdir); 
        return filez.length;
    }
}


async function notesDir() { 
    const dir = process.env.NOTES_FS_DIR 
        || path.join(approotdir, 'notes-fs-data');
    await fs.ensureDir(dir);
    return dir;
} 

const filePath = (notesdir, key) => path.join(notesdir, `${key}.json`);

async function readJSON(notesdir, key) { 
    const readFrom = filePath(notesdir, key); 
    var data = await fs.readFile(readFrom, 'utf8');
    debug(`readJSON ${data}`); 
    return Note.fromJSON(data);
}

async function crupdate(key, title, body) { 
    var notesdir = await notesDir();
    if (key.indexOf('/') >= 0)  
        throw new Error(`key ${key} cannot contain '/'`); 
    var note = new Note(key, title, body); 
    const writeTo = filePath(notesdir, key); 
    const writeJSON = note.JSON; 
    debug(`WRITE ${writeTo} ${writeJSON}`);
    await fs.writeFile(writeTo, writeJSON, 'utf8');
    return note;
}
