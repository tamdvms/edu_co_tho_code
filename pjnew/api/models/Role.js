/**
 * Role.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        roles: {
            type: 'json',
            required: true,
            unique: true
        },
        name: {
            type: 'string',
            required: true
        },
        status: {
            model: 'status',
            required: true
        }
    },

};

