import util from 'util';
import { Note, AbstractNotesStore } from './Notes.mjs';
import level from 'level';
import { default as DBG } from 'debug';
const debug = DBG('notes:notes-level');
const error = DBG('notes:error-level');

var db;

async function connectDB() { 
    if (typeof db !== 'undefined' || db) return db;
    db = await level(
        process.env.LEVELDB_LOCATION || 'notes.level', { 
            createIfMissing: true, 
            valueEncoding: "json" 
    });
    return db;
} 

export default class LevelNotesStore extends AbstractNotesStore {

    async close() {
        var _db = db;
        db = undefined;
        return _db ? _db.close() : undefined;
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
        debug(`reading ${key}`);
        const db = await connectDB();
        const note = Note.fromJSON(await db.get(key));
        debug(`read ${key} => ${util.inspect(note)}`);
        return note; // new Note(note.key, note.title, note.body);
    }

    async destroy(key) {
        const db = await connectDB();
        const note = Note.fromJSON(await db.get(key));
        // console.log(`LevelNotesStore DESTROY ${key}`);
        await db.del(key);
        this.emitDestroyed(key);
        // console.log(`LevelNotesStore DESTROYED ${key}`);
    }

    async keylist() {
        const db = await connectDB();
        var keyz = [];
        await new Promise((resolve, reject) => { 
            db.createKeyStream()
            .on('data', data => keyz.push(data)) 
            .on('error', err => reject(err)) 
            .on('end',   ()  => resolve(keyz));
        }); 
        debug(`keylist returning ${util.inspect(keyz)}`);
        return keyz; 
    }

    async count() {
        const db = await connectDB();
        var total = 0;
        await new Promise((resolve, reject) => { 
            db.createKeyStream()
            .on('data', data => total++) 
            .on('error', err => reject(err)) 
            .on('end',   ()  => resolve(total));
        }); 
        debug(`count returning ${util.inspect(total)}`);
        return total;
    }
}


async function crupdate(key, title, body) { 
    debug(`crupdate ${key} ${title} ${body}`);
    const db = await connectDB();
    var note = new Note(key, title, body); 
    await db.put(key, note.JSON);
    debug(`crupdate saved ${util.inspect(note)}`);
    return note;
}
