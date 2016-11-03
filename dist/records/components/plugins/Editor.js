'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var Editor = (0, _immutable.Record)({
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

exports.default = Editor;