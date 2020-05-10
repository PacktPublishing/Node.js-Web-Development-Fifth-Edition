import * as util from 'util';
import { Note, AbstractNotesStore } from './Notes.mjs';
import Sequelize from 'sequelize';
import { 
    connectDB as connectSequlz,
    close as closeSequlz
} from './sequlz.mjs';
import DBG from 'debug';
const debug = DBG('notes:notes-sequelize'); 
const error = DBG('notes:error-sequelize'); 

var sequelize;
export class SQNote extends Sequelize.Model {}

async function connectDB() {
    if (sequelize) return;
    sequelize = await connectSequlz();
    SQNote.init({
        notekey: { type: Sequelize.DataTypes.STRING, 
            primaryKey: true, unique: true }, 
        title: Sequelize.DataTypes.STRING, 
        body: Sequelize.DataTypes.TEXT 
    }, {
        sequelize,
        modelName: 'SQNote'
    });
    await SQNote.sync();
}

export default class SequelizeNotesStore extends AbstractNotesStore {

    async close() {
        closeSequlz();
        sequelize = undefined;
    }

    async update(key, title, body) {
        await connectDB();
        const note = await SQNote.findOne({ where: { notekey: key } }) 
        if (!note) { 
            throw new Error(`No note found for ${key}`); 
        } else {
            await SQNote.update({ 
                title: title, 
                body: body 
            }, {
                where: { notekey: key }
            });
            let note = await this.read(key);
            debug(`SequelizeNotesStore UPDATE ${util.inspect(note)}`);
            this.emitUpdated(note);
            return note;
        } 
    }

    async create(key, title, body) {
        await connectDB();
        const sqnote = await SQNote.create({ 
            notekey: key, 
            title: title, 
            body: body 
        });
        let note = new Note(sqnote.notekey, sqnote.title, sqnote.body);
        debug(`SequelizeNotesStore CREATE ${util.inspect(note)}`);
        this.emitCreated(note);
        return note;
    }

    async read(key) {
        await connectDB();
        const note = await SQNote.findOne({ where: { notekey: key } });
        // debug(note);
        if (!note) { 
            throw new Error(`No note found for ${key}`); 
        } else { 
            return new Note(note.notekey, note.title, note.body); 
        } 
    }

    async destroy(key) {
        await connectDB();
        await SQNote.destroy({ where: { notekey: key } });
        debug(`SequelizeNotesStore DESTROY ${key}`);
        this.emitDestroyed(key);
    }

    async keylist() {
        await connectDB();
        const notes = await SQNote.findAll({ attributes: [ 'notekey' ] });
        const notekeys = notes.map(note => note.notekey); 
        debug(`SequelizeNotesStore KEYLIST ${notekeys}`);
        return notekeys;
    }

    async count() {
        await connectDB();
        const count = await SQNote.count();
        debug(`COUNT ${count}`); 
        return count; 
    }
}
