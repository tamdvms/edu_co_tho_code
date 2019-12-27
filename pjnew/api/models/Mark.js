/**
 * Mark.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    // Mark
    attributes: {
        year: {
            type: 'number',
            required: true
        },
        mark: {
            type: 'number',
            required: true
        },
        aspiration: {
            type: 'number'
        },
        note: {
            type: 'string'
        },
        major: {
            model: 'major',
            required: true
        },
        school: {
            model: 'school',
            required: true
        },
        subjectGroups: {
            type: 'json',
            required: true
        },
        status: {
            model: 'status',
            required: true
        },
        major: {
            model :'major'
        }
    },

};

