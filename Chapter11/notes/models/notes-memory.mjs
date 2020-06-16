
import { Note, AbstractNotesStore } from './Notes.mjs';

const notes = [];

export default class InMemoryNotesStore extends AbstractNotesStore {

    async close() {
    }

    async update(key, title, body) {
        notes[key] = new Note(key, title, body);
        let note = notes[key];
        this.emitUpdated(note);
        return note;
    }

    async create(key, title, body) {
        notes[key] = new Note(key, title, body);
        let note = notes[key];
        this.emitCreated(note);
        return note;
    }

    async read(key) {
        if (notes[key]) {
            return notes[key];
        }
        else throw new Error(`Note ${key} does not exist`);
    }

    async destroy(key) {
        if (notes[key]) {
            delete notes[key];
            this.emitDestroyed(key);
        } else throw new Error(`Note ${key} does not exist`);
    }

    async keylist() {
        return Object.keys(notes);
    }

    async count() {
        return notes.length;
    }
}


