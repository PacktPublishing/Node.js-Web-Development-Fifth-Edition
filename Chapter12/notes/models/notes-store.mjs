
import { default as DBG } from 'debug';
const debug = DBG('notes:notes-store');
const error = DBG('notes:error-store');
import util from 'util';

var _NotesStore;

export async function useModel(model) {
    try {
        let NotesStoreModule = await import(`./notes-${model}.mjs`);
        debug(`useModel model ${model} => ${util.inspect(NotesStoreModule)}`);
        let NotesStoreClass = NotesStoreModule.default;
        debug(`useModel NotesStore ${util.inspect(NotesStoreClass)}`);
        _NotesStore = new NotesStoreClass();
        return _NotesStore;
    } catch (err) {
        throw new Error(`No recognized NotesStore in ${model} because ${err}`);
    }
}

export { _NotesStore as NotesStore };
