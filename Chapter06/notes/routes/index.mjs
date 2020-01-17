// import * as util from 'util';
import { default as express } from 'express';
import { InMemoryNotesStore } from '../models/notes-memory.mjs';
export const router = express.Router();

const notes = InMemoryNotesStore.store();

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        let keylist = await notes.keylist();
        // console.log(`keylist ${util.inspect(keylist)}`);
        let keyPromises = keylist.map(key => {
            return notes.read(key);
        });
        let notelist = await Promise.all(keyPromises);
        // console.log(util.inspect(notelist));
        res.render('index', { title: 'Notes', notelist: notelist });
    } catch (err) {
        next(err);
    }
});
