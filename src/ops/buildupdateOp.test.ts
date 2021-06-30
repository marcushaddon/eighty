import { Validator } from "jsonschema";
import { buildPatchValidator } from "./buildupdateOp";

describe('buildPatchValidator', () => {
    const validator = new Validator();
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

    const patchValidator = buildPatchValidator(validator);

    it('invalidates invalid paths', () => {
        const res = patchValidator([
            { op: 'replace', path: '/foo', value: 'bar' }
        ]);
        expect(res).toContain('/foo is not a valid PATCH path');
    })

    it('invalidates invalid values', () => {
        const res = patchValidator([
            { op: 'replace', path: '/name', value: 34 }
        ]);

        expect(res).toContain('/name is not of a type(s) string');
        expect(res.length).toEqual(1);
    });

    it('invalidates nested paths', () => {
        const res = patchValidator([
            { op: 'replace', path: '/meta/score', value: []}
        ]);

        expect(res).toContain('/meta/score is not of a type(s) number')
    });

    it('validates object types', () => {
        const res = patchValidator([
            { op: 'replace', path: '/meta', value: { score: 45 }}
        ]);

        expect(res.length).toEqual(0);
    });

    it('invalidates object types', () => {
        const res = patchValidator([
            { op: 'replace', path: '/meta', value: { score: 'foo' }}
        ]);

        expect(res).toContain('/meta/score is not of a type(s) number')
    })
})