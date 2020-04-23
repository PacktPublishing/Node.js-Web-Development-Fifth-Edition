
import util from 'util';
import Chai from 'chai';
const assert = Chai.assert;
import { useModel as useNotesModel } from '../models/notes-store.mjs';

var store;

describe('Initialize', function() {
    it('should successfully load the model', async function() {
        try {
            // Initialize just as in app.mjs
            // If these execute without exception the test succeeds
            store = await useNotesModel(process.env.NOTES_MODEL);
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
});

describe("Model Test", function() {
  describe("check keylist", function() {

    before(async function() {
        await store.create("n1", "Note 1", "Note 1");
        await store.create("n2", "Note 2", "Note 2");
        await store.create("n3", "Note 3", "Note 3");
    });

    it("should have three entries", async function() {
        const keyz = await store.keylist();
        assert.exists(keyz);
        assert.isArray(keyz);
        assert.lengthOf(keyz, 3);
    });
    it("should have keys n1 n2 n3", async function() {
        const keyz = await store.keylist();
        assert.exists(keyz);
        assert.isArray(keyz);
        assert.lengthOf(keyz, 3);
        for (let key of keyz) {
            assert.match(key, /n[123]/, "correct key");
        }
    });
    it("should have titles Node #", async function() {
        const keyz = await store.keylist();
        assert.exists(keyz);
        assert.isArray(keyz);
        assert.lengthOf(keyz, 3);
        var keyPromises = keyz.map(key => store.read(key));
        const notez = await Promise.all(keyPromises);
        for (let note of notez) {
            assert.match(note.title, /Note [123]/, "correct title");
        }
    });

    after(async function() {
        // console.log('beforeEach');
        const keyz = await store.keylist();
        // console.log(`beforeEach keylist ${keyz}`);
        for (let key of keyz) {
            await store.destroy(key);
        }
    });
  });

  describe("read note", function() {
    before(async function() {
        await store.create("n1", "Note 1", "Note 1");
    });

    it("should have proper note", async function() {
        const note = await store.read("n1");
        assert.exists(note);
        assert.deepEqual({
            key: note.key, title: note.title, body: note.body
        }, {
            key: "n1",
            title: "Note 1",
            body: "Note 1"
        });
    });
    
    it("Unknown note should fail", async function() {
        try {
          const note = await store.read("badkey12");
          assert.notExists(note);
          throw new Error("should not get here");
        } catch(err) {
          // An error is expected, so it is an error if
          // the 'should not get here' error is thrown
          assert.notEqual(err.message, "should not get here");
        }
    });

    after(async function() {
        const keyz = await store.keylist();
        for (let key of keyz) {
            await store.destroy(key);
        }
    });
  });

  describe("change note", function() {
    before(async function() {
        await store.create("n1", "Note 1", "Note 1");
    });

    it("after a successful model.update", async function() {
        const newnote = await store.update("n1", "Note 1 title changed", "Note 1 body changed");
        const note = await store.read("n1");
        assert.exists(note);
        assert.deepEqual({
          key: note.key, title: note.title, body: note.body
        }, {
          key: "n1",
          title: "Note 1 title changed",
          body: "Note 1 body changed"
        });
    });

    after(async function() {
        const keyz = await store.keylist();
        for (let key of keyz) {
            await store.destroy(key);
        }
    });
  });

  describe("destroy note", function() {
    before(async function() {
        await store.create("n1", "Note 1", "Note 1");
    });

    it("should remove note", async function() {
            await store.destroy("n1");
            const keyz = await store.keylist();
            assert.exists(keyz);
            assert.isArray(keyz);
            assert.lengthOf(keyz, 0);
            for (let key of keyz) {
                assert.match(key, /n[23]/, "correct key");
            }
    });
    it("should fail to remove unknown note", async function() {
        try {
          await store.destroy("badkey12");
          throw new Error("should not get here");
        } catch(err) {
            // this is expected, so do not indicate error
            assert.notEqual(err.message, "should not get here");
        }
    });

    after(async function() {
        const keyz = await store.keylist();
        for (let key of keyz) {
            await store.destroy(key);
        }
    });
  });

  after(function() {
    // console.log('after -- closing');
    try {
        store.close();
    } catch (err1) {
        console.error('AFTER close NotesStore ', err1);
        throw err1;
    }
  });
});


/*

These will help with diagnosing problems.

process.on('uncaughtException', function(err) { 
    console.error("I've crashed!!! - "+ (err.stack || err)); 
});

process.on('unhandledRejection', (reason, p) => {
    console.error(`Unhandled Rejection at: ${util.inspect(p)} reason:`, reason.stack);
});
*/
