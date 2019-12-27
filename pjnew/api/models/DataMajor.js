module.exports = {
    // DataMajor
    attributes: {
        majorcode: {
            type : 'string'
        },
        subjectGroups: {
            type: 'json'
        },
        mark : {
            type : 'number'
        },
        province: {
            model: 'province'
        },
    },
};


