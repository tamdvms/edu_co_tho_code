/**
 * SchoolController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // 301 dữ liệu gửi lên không hợp lệ
    // 302 có lỗi xảy ra, không có gì được thay đổi
    // 303 không tìm thấy dữ liệu trong database


    //school/get/id
    getId: async (req, res) => {
        res.status(200);
        let code = 303, message = 'error', data = undefined, { id } = req.param('data');
        data = await School.findOne({ id: id }).populate('province');
        if (data) {
            code = 200;
            message = 'success';
        }
        return res.json({ code, message, data });
    },

    // /school/search
    search: async (req, res) => {
        res.status(200);
        let code = 303, message = 'error', data = undefined, { name, page, type, number } = req.param('data'), list = undefined;
        if (!page || page < 0) {
            page = 1;
        }
        try {
            if (type === 'MAJOR') {
                let db = Major.getDatastore().manager;
                list = await db.collection('major').aggregate([
                    {
                        $match: { code: { $regex: number } }
                    },
                    {
                        $lookup: {
                            from: 'school',
                            localField: 'school',
                            foreignField: '_id',
                            as: 'school'
                        },

                    },
                    {
                        $unwind: "$school"
                    },
                    {
                        $lookup: {
                            from: 'province',
                            localField: 'school.province',
                            foreignField: '_id',
                            as: 'province'
                        }
                    },
                    {
                        $lookup: {
                            from: 'mark',
                            localField: '_id',
                            foreignField: 'major',
                            as: 'marks'
                        }
                    },
                    {
                        $unwind: "$marks"
                    },
                    {
                        $match: { "marks.year": 2018 }
                    },
                    { $sort: { "marks.mark": -1 } },
                    // {
                    //     $JSON.parse(marks.subjectGroup)
                    // }
                    // // {
                    // //     $unwind: "$marks.subjectGroup"
                    // // },
                    {
                        $lookup: {
                            from: 'subjectGroup',
                            localField: 'marks.subjectGroup',
                            foreignField: '_id',
                            as: 'subjectGroups'
                        }
                    },
                    { $skip: (page - 1) * 20 },
                    { $limit: 21 }
                ]).toArray((error, rs) => {
                    if (!error) {
                        list = rs;
                        if (list.length > 20) {
                            data = {
                                list: list.slice(0, 20),
                                next: true
                            }
                        } else {
                            data = {
                                list,
                                next: false
                            }
                        }
                        code = 200;
                        message = 'success';


                    }
                    return res.json({ code, message, data });
                });


            }
            else {
                let db = School.getDatastore().manager;
                list = await db.collection('school').aggregate([
                    {
                        $match: {
                            $or: [
                                {
                                    $or: [
                                        { code: { $regex: name, $options: "i" } },
                                        { name: { $regex: name, $options: "i" } }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'province',
                            localField: 'province',
                            foreignField: '_id',
                            as: 'province'
                        }
                    },
                    { $skip: (page - 1) * 20 },
                    { $limit: 21 }
                ]).toArray((error, rs) => {
                    if (!error) {
                        list = rs;
                        if (list.length > 20) {
                            data = {
                                list: list.slice(0, 20),
                                next: true
                            }
                        } else {
                            data = {
                                list,
                                next: false
                            }
                        }
                        code = 200;
                        message = 'success';


                    }
                    return res.json({ code, message, data });
                });
            };

        } catch (error) {
            code = 301;
            return res.json({ code, message, data });
        }

    },



    // /school/getList/:province + subjectGroup


    getList: async (req, res) => {
        res.status(200);
        let code = 200, message = 'success', data = undefined, rs = undefined, list = undefined, { page, province, subjectGroups } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        try {
            let db = Mark.getDatastore().manager;
            listmark = await db.collection('mark').aggregate([
                {
                    $match: {
                        subjectGroups: { $regex: subjectGroups }
                    }
                },
                {
                    $group: { _id: "$school" }
                }
            ]).toArray(async (error, rs) => {
                if (!error) {
                    let listid1 = [];
                    let listid2 = [];
                    let listid3 = [];
                    for (let i = 0; i < rs.length; i++) {
                        listid1.push(String(rs[i]._id));
                    }
                    //tìm trường có Khối + trong tỉnh
                    let listin = await School.find({ id: { in: listid1 }, province: province }).populate('province').limit(11).skip((page - 1) * 20);
                    //tìm trường có khối + trong khu vực
                    let tmp1 = await Province.findOne({ id: province });
                    let sectorid = tmp1.sector;
                    let tmp2 = await Province.find({ sector: sectorid });
                    for (let i = 0; i < tmp2.length; i++) {
                        if (tmp2[i].id != province) {
                            listid2.push((tmp2[i].id));
                        }
                    }
                    let listst = await School.find({ id: { in: listid1 }, province: { in: listid2 } }).populate('province').limit(11).skip((page - 1) * 20);
                    let lista = listin.concat(listst);
                    //tìm tường có khối - tỉnh - khu vực
                    for (let i = 0; i < tmp2.length; i++) {
                        if (tmp2[i].id != province) {
                            listid3.push((tmp2[i].id));
                        }
                    }
                    let listcl = await School.find({ id: { in: listid1 }, province: { nin: listid3 } }).populate('province').limit(11).skip((page - 1) * 20);
                    list = listin.concat(listst).concat(listcl);
                    if (list.length > 20) {
                        data = {
                            list: list.slice(0, 20),
                            next: true
                        }
                    } else {
                        data = {
                            list,
                            next: false
                        }
                    }
                    code = 200;
                    message = 'success';
                }
                return res.json({ code, message, data });
            });
        }
        catch (error) {
            code = 301;
            return res.json({ code, message, data });
        }
    },

    suggest: async (req, res) => {
        // ObjectID = require('sails-mongo/node_modules/mongodb').ObjectID;
        res.status(200);
        let code = 200, message = 'Error', data = undefined, rs = undefined, list = undefined, { page, subjectGroups, mark, majorcode, year, province } = req.param('data');
        if (!page || page < 0) {
            page = 1;
        }
        if (!year) {
            year = 2018;
        }
        let logdata = await DataMajor.create({ subjectGroups, mark, majorcode, province });
        try {
            if (!subjectGroups && !mark && !majorcode && !province) {
                list = await School.find().populate('province').limit(21).skip((page - 1) * 20);
                if (list.length > 20) {
                    data = {
                        list: list.slice(0, 20),
                        next: true
                    }
                } else {
                    data = {
                        list,
                        next: false
                    }
                }
                code = 200;
                message = 'success';
                return res.json({ code, message, data });
            } else {
                    // lấy list id tổ hợp môn (id trong bảng mark) 
                let lsubjectGroupsid = [];
                if (!subjectGroups) {
                    let fsubjectGroups = await Mark.find();
                    for (let i = 0; i < fsubjectGroups.length; i++) {
                        lsubjectGroupsid.push(String(fsubjectGroups[i].id));
                    }
                } else {
                    let fsubjectGroups = await Mark.find({ subjectGroups: { contains: subjectGroups } });
                    for (let i = 0; i < fsubjectGroups.length; i++) {
                        lsubjectGroupsid.push(String(fsubjectGroups[i].id));
                    }
                }

                // lấy listid major
                let lmajorid = [];
                if (!majorcode) {
                    let fmajor = await Major.find();
                    for (let i = 0; i < fmajor.length; i++) {
                        lmajorid.push(String(fmajor[i].id));
                    }
                }
                else {
                    let fmajor = await Major.find({ code: { contains: majorcode } });
                    for (let i = 0; i < fmajor.length; i++) {
                        lmajorid.push(String(fmajor[i].id));
                    }
                }
                //lấy list mark 
                let markfrom = undefined;
                let markto = undefined;
                if (!mark) {
                    markfrom = 0;
                    markto = 30;
                }
                else {
                    markfrom = mark;
                    markto = mark + 3;
                };
                // lấy list id school trong tỉnh
                let lschoolid = [];
                let lschoolid1 = [];
                let lschoolid2 = [];
                let lprovinceid = [];
                let lsectorid = [];
                let lnsectorid = [];
                if (!province) {
                    let lschool = await School.find();
                    for (let i = 0; i < lschool.length; i++) {
                        lschoolid.push(String(lschool[i].id));
                    }
                }
                else {
                    //lấy danh sách trường trong tỉnh
                    let lschool = await School.find({ province: province });
                    for (let i = 0; i < lschool.length; i++) {
                        lschoolid.push(String(lschool[i].id));
                    }

                    //lấy danh sách trường trong khu vực  (- tỉnh req)
                    let fsector = await Province.findOne({ id: province });
                    let sector = fsector.sector;
                    let fprovince = await Province.find({ sector: sector });
                    for (let i = 0; i < fprovince.length; i++) {
                        if (fprovince[i].id != province) {
                            lprovinceid.push(String(fprovince[i].id));
                        }
                    }
                    let lschoolst = await School.find({ province: { in: lprovinceid } });
                    for (let i = 0; i < lschoolst.length; i++) {
                        lschoolid1.push(String(lschoolst[i].id));
                    }
                    // lấy danh sách trường trong khu vực (kể cả tỉnh req )
                    for (let i = 0; i < fprovince.length; i++) {
                        lnsectorid.push(String(fprovince[i].id));
                    }
                    let lnschoolst = await School.find({ province: { in: lnsectorid } });
                    for (let i = 0; i < lnschoolst.length; i++) {
                        lschoolid2.push(String(lnschoolst[i].id));
                    }
                }

                let list1 = await Mark.find({ school: { in: lschoolid }, major: { in: lmajorid }, year: year, mark: { '>=': markfrom, '<': markto }, id: { in: lsubjectGroupsid } });
                let list2 = await Mark.find({ school: { in: lschoolid1 }, major: { in: lmajorid }, year: year, mark: { '>=': markfrom, '<': markto }, id: { in: lsubjectGroupsid } });
                let list3 = await Mark.find({ school: { nin: lschoolid2 }, major: { in: lmajorid }, year: year, mark: { '>=': markfrom, '<': markto }, id: { in: lsubjectGroupsid } });


                let listschoolid1 = [];
                for (let i = 0; i < list1.length; i++) {
                    listschoolid1.push(String(list1[i].school));
                }
                let x1 = listschoolid1.filter((v, i) => listschoolid1.indexOf(v) === i);
                let listsuggest1 = await School.find({ id: { in: x1 } }).populate('province');

                let listschoolid2 = [];
                for (let i = 0; i < list2.length; i++) {
                    listschoolid2.push(String(list2[i].school));
                }

                let x2 = listschoolid2.filter((v, i) => listschoolid2.indexOf(v) === i);
                let listsuggest2 = await School.find({ id: { in: x2 } }).populate('province');


                let listschoolid3 = [];
                for (let i = 0; i < list3.length; i++) {
                    listschoolid3.push(String(list3[i].school));
                }
                let x3 = listschoolid3.filter((v, i) => listschoolid3.indexOf(v) === i);
                let listsuggest3 = await School.find({ id: { in: x3 } }).populate('province');


                list = listsuggest1.concat(listsuggest2).concat(listsuggest3);

            }
                if (list.length > 20) {
                    data = {
                        list: list.slice(0, 20),
                        next: true
                    }
                } else {
                    data = {
                        list,
                        next: false
                    }
                }
                code = 200;
                message = 'success';
                return res.json({ code, message, data });
            
        } catch (error) {
            code = 301;
            return res.json({ code, message, data });
        }
},

};


