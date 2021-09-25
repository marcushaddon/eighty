"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonschema_1 = require("jsonschema");
var buildPatchValidator_1 = require("./buildPatchValidator");
describe('patchValidator', function () {
    var validator = new jsonschema_1.Validator();
    validator.addSchema({
        properties: {
            name: {
                type: 'string'
            },
            age: {
                type: 'number'
            },
            meta: {
                type: 'object',
                properties: {
                    score: {
                        type: 'number'
                    }
                }
            }
        }
    }, 'test');
    var permissiveValidator = buildPatchValidator_1.buildPatchValidator(validator, 'allow');
    it('ignores unkown paths', function () {
        var res = permissiveValidator([
            { op: 'replace', path: '/foo', value: 'bar' }
        ]);
        expect(res.length).toEqual(0);
    });
    it('invalidates invalid values', function () {
        var res = permissiveValidator([
            { op: 'replace', path: '/name', value: 34 }
        ]);
        expect(res).toContain('/name is not of a type(s) string');
        expect(res.length).toEqual(1);
    });
    it('invalidates nested paths', function () {
        var res = permissiveValidator([
            { op: 'replace', path: '/meta/score', value: [] }
        ]);
        expect(res).toContain('/meta/score is not of a type(s) number');
    });
    it('validates object types', function () {
        var res = permissiveValidator([
            { op: 'replace', path: '/meta', value: { score: 45 } }
        ]);
        expect(res.length).toEqual(0);
    });
    it('invalidates object types', function () {
        var res = permissiveValidator([
            { op: 'replace', path: '/meta', value: { score: 'foo' } }
        ]);
        expect(res).toContain('/meta/score is not of a type(s) number');
    });
});
