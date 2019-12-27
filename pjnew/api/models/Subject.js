/**
 * Subject.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    // Subject
    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        description: {
            type: 'string'
        },
        status: {
            model: 'status',
            required: true
        }
    }

};

