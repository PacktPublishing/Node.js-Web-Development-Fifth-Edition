import assert from 'assert';
import { deleteFile } from './deleteFile.mjs';

deleteFile("no-such-file", (err) => {
    assert.ok(err);
    assert.ok(err instanceof Error);
    assert.match(err.message, /does not exist/);
});