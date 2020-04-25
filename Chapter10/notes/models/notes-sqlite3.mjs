import util from 'util';
import { Note, AbstractNotesStore } from './Notes.mjs';
import { default as sqlite3 } from 'sqlite3';
import { default as DBG } from 'debug';
const debug = DBG('notes:notes-sqlite3');
const error = DBG('notes:error-sqlite3');

var db;
 
async function connectDB() {
    if (db) return db;
    var dbfile = process.env.SQLITE_FILE || "notes.sqlite3"; 
    await new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbfile,
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            err => {
                if (err) return reject(err);
                debug(`Opened SQLite3 database ${dbfile} db=${util.inspect(db)}`);
                resolve(db);
        });
    });
    return db;
}

export default class SQLITE3NotesStore extends AbstractNotesStore {

    async close() {
        var _db = db;
        db = undefined;
        return _db ?
            new Promise((resolve, reject) => {
                _db.close(err => {
                    if (err) reject(err);
                    else resolve();
                });
            }) : undefined;
    }

    async update(key, title, body) {
        var db = await connectDB();
        var note = new Note(key, title, body); 
        await new Promise((resolve, reject) => { 
            db.run("UPDATE notes "+
                "SET title = ?, body = ? "+
                "WHERE notekey = ?",
                [ title, body, key ], err => {
                    if (err) return reject(err);
                    debug(`UPDATE ${util.inspect(note)}`);
                    resolve(note);
            });
        });
        this.emitUpdated(note);
        return note;
    }

    async create(key, title, body) {
        var db = await connectDB();
        var note = new Note(key, title, body);
        await new Promise((resolve, reject) => {
            db.run("INSERT INTO notes ( notekey, title, body) "+
                "VALUES ( ?, ? , ? );",
                [ key, title, body ], err => {
                    if (err) return reject(err);
                    debug(`CREATE ${util.inspect(note)}`);
                    resolve(note);
            });
        });
        this.emitCreated(note);
        return note;
    }

    async read(key) {
        var db = await connectDB();
        var note = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM notes WHERE notekey = ?",
                [ key ], (err, row) => {
                if (err) return reject(err);
                const note = new Note(row.notekey,
                                row.title, row.body);
                debug(`READ ${util.inspect(note)}`);
                resolve(note);
            });
        });
        return note;
    }

    async destroy(key) {
        var db = await connectDB();
        return await new Promise((resolve, reject) => {
            db.run("DELETE FROM notes WHERE notekey = ?;",
                [ key ], err => {
                if (err) return reject(err);
                debug(`DESTROY ${key}`);
                this.emitDestroyed(key);
                resolve();
            });
        });
    }

    async keylist() {
        var db = await connectDB();
        debug(`keylist db=${util.inspect(db)}`);
        var keyz = await new Promise((resolve, reject) => {
            var keyz = [];
            db.all("SELECT notekey FROM notes",
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows.map(row => {
                        return row.notekey;
                    }));
                });
        });
        return keyz;
    }

    async count() {
        var db = await connectDB();
        var count = await new Promise((resolve, reject) => {
            db.get("select count(notekey) as count from notes",
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row.count);
                });
        });
        return count;
    }
}
