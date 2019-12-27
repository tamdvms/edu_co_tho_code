/**
 * Major.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    // Major
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        code: {
            type: 'string',
            required: true
        },
        school: {
            model: 'school',
            required: true
        },
        status: {
            model: 'status',
            required: true
        },
        marks :{
            collection :'mark',
            via :'major'

        },
       
    }
};

