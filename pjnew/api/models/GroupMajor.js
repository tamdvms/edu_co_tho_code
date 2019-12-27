module.exports = {
    // GroupMajor
    attributes: {
        name: {
            type : 'string'
        },
        groupmajoritem:{
            collection: 'groupmajoritem',
            via:'groupmajor'
        },
    },
};


