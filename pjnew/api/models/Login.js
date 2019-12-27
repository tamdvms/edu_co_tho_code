/**
 * Login.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        session: {
            type: 'string',
            required: true
        },
        time: {
            type: 'number',
            required: true
        },
        user: {
            type: 'json',
            required: true
        }
    },

};

