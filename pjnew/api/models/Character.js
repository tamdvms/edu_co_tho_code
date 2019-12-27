/**
 * Major.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    // Character
    attributes: {
        code : {
            type : 'string'
        },
        name: {
            type: 'string'
        },
        content: {
           type: 'string'
        },
        questions : {
            collection : 'questions',
            via :'character'
        },
        p4: {
            model :'p4'
        }
    }
};

