/**
 * New.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string'
        },
        image: {
            type: 'string'
        },
        link: {
            type: 'string'
        },
        content :{
            model :'content'
        },
        p1: {
            model: 'p1'
        },
        p2: {
            model: 'p2'
        },
        p3: {
            model: 'p3'
        },
        p4: {
            model: 'p4'
        }
        
    },

};

