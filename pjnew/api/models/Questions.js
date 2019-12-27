/**
 * Questions.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    // Questions
    attributes: {
        content: {
            type : 'string'
        },
          character : {
            model :'character'
        },
       
    }
};

