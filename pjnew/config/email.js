



// module.exports.email = {
// 	service: 'Mailgun',
// 	auth: {
// 		user: 'postmaster@sandbox3fc955c6e368499cb61da920bd80efe9.mailgun.org', 
// 		pass: 'f8f39465e946baa2491fca1f92ad256d-4412457b-0e3b2a18'
// 	},
// 	templateDir: 'views/emailTemplates/',
// 	from: 'postmaster@sandbox3fc955c6e368499cb61da920bd80efe9.mailgun.org',
// 	testMode: false,

// };

module.exports.email = {
    service: 'Gmail',
    auth: {
        user: 'resettoken.auto@gmail.com',
        pass: '@123123@',
    },
    templateDir: "views/emailTemplates/",
    testMode: false
};