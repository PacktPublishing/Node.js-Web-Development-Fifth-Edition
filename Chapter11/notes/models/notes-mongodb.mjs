import { Note, AbstractNotesStore } from './Notes.mjs';
import mongodb from 'mongodb'; 
const MongoClient = mongodb.MongoClient;
import DBG from 'debug';
const debug = DBG('notes:notes-mongodb'); 
const error = DBG('notes:error-mongodb'); 

var client;

const connectDB = async () => { 
    if (!client) client = await MongoClient.connect(process.env.MONGO_URL);
}
const db = () => { return client.db(process.env.MONGO_DBNAME); };

export default class MongoDBNotesStore extends AbstractNotesStore {

    async close() {
        if (client) client.close();
        client = undefined;
    }

    async update(key, title, body) {
        await connectDB();
        const note = new Note(key, title, body); 
        const collection = db().collection('notes'); 
        await collection.updateOne({ notekey: key }, 
                { $set: { title: title, body: body } });
        this.emitUpdated(note);
        return note;
    }

    async create(key, title, body) {
        await connectDB();
        const note = new Note(key, title, body); 
        const collection = db().collection('notes'); 
        await collection.insertOne({ 
            notekey: key, title: title, body: body 
        });
        this.emitCreated(note);
        return note;
    }

    async read(key) {
        await connectDB();
        const collection = db().collection('notes');
        const doc = await collection.findOne({ notekey: key });
        const note = new Note(doc.notekey, doc.title, doc.body);
        return note; 
    }

    async destroy(key) {
        await connectDB();
        const collection = db().collection('notes');
        const doc = await collection.findOne({ notekey: key });
        if (!doc) {
            throw new Error(`No note found for ${key}`);
        } else {
            await collection.findOneAndDelete({ notekey: key });
            this.emitDestroyed(key);
        }
    }

    async keylist() {
        await connectDB();
        debug(`keylist`);
        const collection = db().collection('notes'); 
        const keyz = await new Promise((resolve, reject) => { 
            var keyz = []; 
            collection.find({}).forEach( 
                note => { keyz.push(note.notekey); }, 
                err  => { 
                    if (err) reject(err); 
                    else resolve(keyz); 
                } 
            ); 
        }); 
        return keyz;
    }

    async count() {
        await connectDB();
        const collection = db().collection('notes');
        const count = await collection.count({});
        return count;
    }
}
