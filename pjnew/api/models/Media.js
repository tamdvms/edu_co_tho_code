/**
 * Media.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        link: {
            type: 'string'
        },
        kind: {
            type: 'string'
        },
        status: {
            model: 'status',
            required: true
        }
    },

};

