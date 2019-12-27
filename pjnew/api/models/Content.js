/**
 * Major.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    // Major
    attributes: {
        job: {
            model: 'job',
            required: true
        },
        tongquan: {
            type: 'string'
        },
        tochat: {
           type: 'string'
        },
        chuyennghe: {
            type: 'string'
        },
        khampha :{
           type : 'string'

        },
       
    }
};

