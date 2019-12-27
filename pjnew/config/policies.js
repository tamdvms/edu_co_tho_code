/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

    /***************************************************************************
    *                                                                          *
    * Default policy for all controllers and actions, unless overridden.       *
    * (`true` allows public access)                                            *
    *                                                                          *
    ***************************************************************************/

    // '*': true,
    '*': 'isLoggedIn',
    //ADMIN
    'admin/sector/getall': 'canView',
    'admin/major/getall': 'canView',
    'admin/mark/getall': 'canView',
    'admin/status/getall': 'canView',
    'admin/province/getall': 'canView',
    'admin/school/getall': 'canView',
    'admin/subject/getall': 'canView',
    'admin/subjectgroup/getall': 'canView',
    'admin/new/getall': 'canView',
    'admin/job/getall': 'canView',
    'admin/majorproperties/getall': 'canView',

    'admin/media/getlist': 'canView',

    'admin/sector/getone': 'canUpdate',
    'admin/major/getone': 'canUpdate',
    'admin/mark/getone': 'canUpdate',
    'admin/status/getone': 'canUpdate',
    'admin/province/getone': 'canUpdate',
    'admin/school/getone': 'canUpdate',
    'admin/subject/getone': 'canUpdate',
    'admin/subjectgroup/getone': 'canUpdate',
    'admin/new/getone': 'canUpdate',
    'admin/job/getone': 'canUpdate',
    'admin/majorproperties/getone': 'canUpdate',

    'admin/sector/add': 'canAdd',
    'admin/major/add': 'canAdd',
    'admin/mark/add': 'canAdd',
    'admin/status/add': 'canAdd',
    'admin/province/add': 'canAdd',
    'admin/school/add': 'canAdd',
    'admin/subject/add': 'canAdd',
    'admin/subjectgroup/add': 'canAdd',
    'admin/new/add': 'canAdd',
    'admin/job/add': 'canAdd',
    'admin/majorproperties/add': 'canAdd',

    'admin/sector/update': 'canUpdate',
    'admin/major/update': 'canUpdate',
    'admin/mark/update': 'canUpdate',
    'admin/status/update': 'canUpdate',
    'admin/province/update': 'canUpdate',
    'admin/school/update': 'canUpdate',
    'admin/subject/update': 'canUpdate',
    'admin/subjectgroup/update': 'canUpdate',
    'admin/new/update': 'canUpdate',
    'admin/job/update': 'canUpdate',
    'admin/majorproperties/update': 'canUpdate',

    'admin/sector/updatestatus': 'canDelete',
    'admin/major/updatestatus': 'canDelete',
    'admin/mark/updatestatus': 'canDelete',
    'admin/province/updatestatus': 'canDelete',
    'admin/school/updatestatus': 'canDelete',
    'admin/subject/updatestatus': 'canDelete',
    'admin/subjectgroup/updatestatus': 'canDelete',
    'admin/new/updatestatus': 'canDelete',
    'admin/media/updatestatus': 'canDelete',
    'admin/job/updatestatus': 'canDelete',
    'admin/majorproperties/updatestatus': 'canDelete',

    'admin/sector/delete': 'isRoot',
    'admin/major/delete': 'isRoot',
    'admin/mark/delete': 'isRoot',
    'admin/status/delete': 'isRoot',
    'admin/province/delete': 'isRoot',
    'admin/school/delete': 'isRoot',
    'admin/subject/delete': 'isRoot',
    'admin/subjectgroup/delete': 'isRoot',
    'admin/new/delete': 'isRoot',
    'admin/job/delete': 'isRoot',
    'admin/majorproperties/delete': 'isRoot',

    'admin/role/*': 'isRoot',
    'user/*': 'isRoot',
    // 'user/update': 'canUpdate',


    'frontend/user/login': true,
    'frontend/user/loginfacebook': true,
    'frontend/user/loginsession': true,
    'frontend/user/updateprofile': true,
    'frontend/user/logout': true,
    'frontend/user/register': true,
    'frontend/user/updatepassword': true,
    'frontend/user/getkey': true,
    'frontend/user/resetpassword': true,

    'user/logout': true,
    'user/getkey': true,
    'user/resetpass': true,
    'user/update': true,
    'user/getall': true,
    'user/login': true,
    'user/loginadmin': true,

    'admin/sector/getall': true,
    'admin/major/getall': true,
    'admin/mark/getall': true,
    'admin/status/getall': true,
    'admin/province/getall': true,
    'admin/school/getall': true,
    'admin/subject/getall': true,
    'admin/subjectgroup/getall': true,
    'admin/new/getall': true,
    'admin/image/upload': true,
    'admin/media/upload': true,

    //FRONTEND
    'frontend/province/getall': true,
    'frontend/province/getone': true,

    'frontend/subjectgroup/getall': true,

    'frontend/school/getid': true,
    'frontend/school/search': true,
    'frontend/school/getlist': true,
    'frontend/school/suggest': true,

    'frontend/mark/getlist': true,

    'frontend/new/getall': true,
    'frontend/new/getone': true,
    'frontend/new/search': true,

    'frontend/majormain/getall': true,

    'frontend/majorproperties/getall': true,
    'frontend/majorproperties/getone': true,
   


    'frontend/job/getone': true,
    'frontend/job/search': true,
    'frontend/job/getlist': true,

    'frontend/p1/getall': true,
    'frontend/p2/getall': true,
    'frontend/p3/getall': true,
    'frontend/p4/getall': true,


    'frontend/careertest/getlist': true,


};
