import {
    Record
} from 'immutable';

const Editor = Record({
    key: null,
    values: null,
    rowIndex: null,
    top: null,
    valid: null,
    isCreate: null,
    overrides: null,
    previousValues: null,
    lastUpdate: 0
});

export default Editor;
