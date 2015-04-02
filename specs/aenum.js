// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var TYPE = require('thriftrw/TYPE');

module.exports.AEnum = AEnum;

function AEnum(definitions) {
    var self = this;
    self.namesToValues = {};
    self.valuesToNames = {};
    var value = 0;
    for (var index = 0; index < definitions.length; index++) {
        var definition = definitions[index];
        var name = definition.id.name;
        value = definition.value != null ? definition.value : value;
        if (self.namesToValues[name] !== undefined) {
            throw new Error('Can\'t create enum with duplicate name ' + name + ' for value ' + value);
        }
        if (value > 0x7fffffff) {
            throw new Error('Can\'t create enum with value out of bounds ' + value + ' for name ' + name);
        }
        self.namesToValues[name] = value;
        self.valuesToNames[value] = name;
        value++;
    }
}

AEnum.prototype.typeid = TYPE.I32;

AEnum.prototype.reify = function reify(value) {
    var self = this;
    if (typeof value !== 'number') {
        throw new Error('Can\'t decode ' + typeof value + ' for enum, number expected');
    }
    if (self.valuesToNames[value] === undefined) {
        throw new Error('Can\'t decode unknown value for enum ' + value);
    }
    return self.valuesToNames[value];
};

AEnum.prototype.uglify = function uglify(name) {
    var self = this;
    if (typeof name !== 'string') {
        throw new Error('Can\'t encode ' + typeof name + ' for enum, string expected');
    }
    if (self.namesToValues[name] === undefined) {
        throw new Error('Can\'t encode unknown name for enum ' + name);
    }
    return self.namesToValues[name];
};