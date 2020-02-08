
const _note_key = Symbol('key');
const _note_title = Symbol('title');
const _note_body = Symbol('body');

export class Note { 
    constructor(key, title, body) { 
        this[_note_key] = key; 
        this[_note_title] = title; 
        this[_note_body] = body; 
    } 

    get key() { return this[_note_key]; }
    get title() { return this[_note_title]; }
    set title(newTitle) { this[_note_title] = newTitle; }
    get body() { return this[_note_body]; }
    set body(newBody) { this[_note_body] = newBody; }

    get JSON() { 
        return JSON.stringify({ 
            key: this.key, title: this.title, body: this.body 
        }); 
    }

    static fromJSON(json) { 
        const data = JSON.parse(json);
        if (typeof data !== 'object'
          || !data.hasOwnProperty('key')
          || typeof data.key !== 'string'
          || !data.hasOwnProperty('title')
          || typeof data.title !== 'string'
          || !data.hasOwnProperty('body')
          || typeof data.body !== 'string') {
            throw new Error(`Not a Note: ${json}`);
        }
        const note = new Note(data.key, data.title, data.body); 
        return note; 
    }
}


import EventEmitter from 'events'; 

export class AbstractNotesStore extends EventEmitter {
    static store() { }
    async close() { }
    async update(key, title, body) { }
    async create(key, title, body) { }
    async read(key) { }
    async destroy(key) { }
    async keylist() { }
    async count() { }
    
    emitCreated(note) { this.emit('notecreated', note);  }
    emitUpdated(note) { this.emit('noteupdated', note);  }
    emitDestroyed(key) { this.emit('notedestroyed', key);  }
}
