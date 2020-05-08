// import * as util from 'util';
import { default as express } from 'express';
import { NotesStore as notes } from '../models/notes-store.mjs';
import { twitterLogin } from './users.mjs';
export const router = express.Router();

import { ensureAuthenticated } from './users.mjs'; 

// Add Note. (create)
router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: "",
        user: req.user,
        twitterLogin: twitterLogin,
        note: undefined
    });
});

// Save Note (update)
router.post('/save', ensureAuthenticated, async (req, res, next) => {
    try {
        var note;
        if (req.body.docreate === "create") {
            note = await notes.create(req.body.notekey,
                    req.body.title, req.body.body);
        } else {
            note = await notes.update(req.body.notekey,
                    req.body.title, req.body.body);
        }
        res.redirect('/notes/view?key='+ req.body.notekey);
    } catch (err) { next(err); }
});

// Read Note (read)
router.get('/view', async (req, res, next) => {
    try {
        var note = await notes.read(req.query.key);
        res.render('noteview', {
            title: note ? note.title : "",
            notekey: req.query.key,
            user: req.user ? req.user : undefined,
            twitterLogin: twitterLogin,
            note: note
        });
    } catch (err) { next(err); }
});

// Edit note (update)
router.get('/edit', ensureAuthenticated, async (req, res, next) => {
    try {
        var note = await notes.read(req.query.key);
        res.render('noteedit', {
            title: note ? ("Edit " + note.title) : "Add a Note",
            docreate: false,
            notekey: req.query.key,
            user: req.user,
            twitterLogin: twitterLogin,
            note: note
        });
    } catch (err) { next(err); }
});

// Ask to Delete note (destroy)
router.get('/destroy', ensureAuthenticated, async (req, res, next) => {
    try {
        var note = await notes.read(req.query.key);
        res.render('notedestroy', {
            title: note ? `Delete ${note.title}` : "",
            notekey: req.query.key,
            user: req.user,
            twitterLogin: twitterLogin,
            note: note
        });
    } catch (err) { next(err); }
});

// Really destroy note (destroy)
router.post('/destroy/confirm', ensureAuthenticated, async (req, res, next) => {
    try {
        await notes.destroy(req.body.notekey);
        res.redirect('/');
    } catch (err) { next(err); }
});
