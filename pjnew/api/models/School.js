/**
 * School.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    // School
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        code: {
            type: 'string',
            unique: true,
            required: true
        },
        description: {
            type: 'string'
        },
        province: {
            model: 'province'
        },
        image: {
            type: 'string'
        },
        status: {
            model: 'status',
            required: true
        },
        pro :{
            collection :'province',
            via : 'school'
        } 

    }

};

