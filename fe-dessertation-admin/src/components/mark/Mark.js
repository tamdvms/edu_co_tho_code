import React, { Component, Fragment } from 'react';
import MarkItem from './MarkItem';
import { connect } from 'react-redux';
import * as actions from '../../actions/MarkActions';
import toastr from 'toastr';
import { findRole } from './../../custom/CusFunction';
import * as roles from './../../contants/roles';
import { toastrOption, selectStyle } from './../../custom/Custom';
import * as status from './../../contants/status';
import Select from 'react-select';
import SchoolApi from './../../api/SchoolApi';
import MajorApi from '../../api/MajorApi';
import * as qs from 'query-string';

class Mark extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            next: true,
            marks: [],
            update: false,
            delete: false,

            statusSelectedOption: null,
            statusOptions: [],
            statusFilter: undefined,

            schoolSelectedOption: null,
            schoolOptions: [],
            schoolFilter: undefined,
            pageSchool: 1,
            nextSchool: false,
            school: [],

            majorSelectedOption: null,
            majorOptions: [],
            majorFilter: undefined,
            pageMajor: 1,
            nextMajor: false,
            major: [],

            yearSelectedOption: null,
            yearOptions: [],
            yearFilter: undefined,

            loading: false
        }
        toastr.options = toastrOption;
    }

    async componentDidMount() {
        let yearOptions = [{
            value: undefined,
            label: 'Tất cả'
        }];
        for (let year = (new Date).getFullYear(); year >= 2014; year--) {
            yearOptions.push({
                value: year,
                label: year
            });
        }

        await this.setState({ yearOptions });
        await this.initStatusOptions(this.props);
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadMarks();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadMarks();
        }
        if (this.props.status !== nextProps.status) {
            await this.initStatusOptions(nextProps);
            this.initSelectedOption();
        }
        let { marks, next } = nextProps.data;
        let { user } = nextProps;
        let update = findRole(user.role, roles.UPDATE) !== -1, del = findRole(user.role, roles.DELETE) !== -1;
        this.setState({ marks, next, update, delete: del });
    }

    initFilter = filter => {
        let { page, statusFilter, yearFilter, schoolFilter, majorFilter } = filter;
        // valid page, year
        page = Number(page) || 1;
        page = page < 0 ? 1 : page;
        yearFilter = Number(yearFilter) || undefined;
        this.setState({ page, statusFilter, yearFilter, schoolFilter, majorFilter }, this.initSelectedOption);
    }

    initSelectedOption = async () => {
        let { statusFilter, statusOptions, yearFilter, yearOptions, schoolFilter, majorFilter } = this.state;
        let statusSelectedOption = statusOptions ? statusOptions.find(el => el.value === statusFilter) : undefined;
        let yearSelectedOption = yearOptions ? yearOptions.find(el => el.value === yearFilter) : undefined;
        // load school selected
        let { session } = this.props;
        let schoolSelectedOption, majorSelectedOption;
        if (schoolFilter) {
            let s = await SchoolApi.getOne({ session, id: schoolFilter });
            schoolSelectedOption = s.body.code === 200 ? { label: s.body.data.name } : undefined;
        }
        if (majorFilter) {
            let m = await MajorApi.getOne({ session, id: majorFilter });
            majorSelectedOption = m.body.code === 200 ? { label: m.body.data.name } : undefined;
        }
        this.setState({ statusSelectedOption, yearSelectedOption, schoolSelectedOption, majorSelectedOption });
    }

    pushUrl = () => {
        let { page, statusFilter, schoolFilter, majorFilter, yearFilter } = this.state;
        let query = '?';
        query += page ? ('page=' + page) : '';
        query += statusFilter ? ('&statusFilter=' + statusFilter) : '';
        query += schoolFilter ? ('&schoolFilter=' + schoolFilter) : '';
        query += majorFilter ? ('&majorFilter=' + majorFilter) : '';
        query += yearFilter ? ('&yearFilter=' + yearFilter) : '';
        this.props.history.push(this.props.location.pathname + query);
    }

    initStatusOptions = props => {
        if (props.status && props.status.length !== 0) {
            let statusOptions = [{ value: undefined, label: 'Tất cả' }, ...props.status.map(el => ({ value: el.id, label: el.name }))];
            this.setState({
                statusOptions
            });
        }
    }

    loadSchools = async page => {
        let rs = await SchoolApi.getAll({
            page,
            session: this.props.session
        });

        this.setState({
            school: [{ id: undefined, name: 'Tất cả' }, ...rs.body.data.list],
            nextSchool: rs.body.data.next,
            pageSchool: page
        });
    }

    loadMajors = async page => {
        let rs = await MajorApi.getAll({
            page,
            session: this.props.session,
            school: this.state.schoolFilter
        });

        this.setState({
            major: [{ id: undefined, name: 'Tất cả' }, ...rs.body.data.list],
            nextMajor: rs.body.data.next,
            pageMajor: page
        });
    }

    newPage = (e, num) => {
        e.preventDefault();
        let { page, next } = this.state;
        page += num;
        if (page === 0 || (!next && num > 0)) {
            return;
        } else {
            this.setState({ page }, this.pushUrl);
        }
    }

    newPageSchool = (e, num) => {
        e.preventDefault();
        let { pageSchool, nextSchool } = this.state;
        pageSchool += num;
        if (pageSchool === 0 || (!nextSchool && num > 0)) {
            return;
        } else {
            this.loadSchools(pageSchool);
        }
    }

    newPageMajor = (e, num) => {
        e.preventDefault();
        let { pageMajor, nextMajor } = this.state;
        pageMajor += num;
        if (pageMajor === 0 || (!nextMajor && num > 0)) {
            return;
        } else {
            this.loadMajors(pageMajor);
        }
    }

    genListMark = () => {
        let { marks } = this.state;
        let rs = null;
        if (marks) {
            rs = marks.map((mark, index) => {
                return (
                    <MarkItem
                        key={index}
                        mark={mark}
                        updateStatus={this.updateStatus}
                        delete={this.state.delete}
                        update={this.state.update}
                    />
                );
            });
        }
        return rs;
    }

    genListSchool = () => {
        let { school } = this.state;
        let rs = null;
        rs = school.map((s, i) => (
            <a
                key={i}
                className={"list-group-item h-hand " + (s.id === this.state.schoolFilter ? 'active' : '')}
                onClick={() => this.handleChangeSchool(s)}
            >{s.name}</a>
        ));
        return rs;
    }

    genListMajor = () => {
        let { major } = this.state;
        let rs = null;
        rs = major.map((s, i) => (
            <a
                key={i}
                className={"list-group-item h-hand " + (s.id === this.state.majorFilter ? 'active' : '')}
                onClick={() => this.handleChangeMajor(s)}
            >{s.name}</a>
        ));
        return rs;
    }

    loadMarks = () => {
        this.setState({ loading: true });
        let { page, statusFilter, schoolFilter, majorFilter, yearFilter } = this.state;
        this.props.loadMarks(page, statusFilter, schoolFilter, majorFilter, yearFilter).then(res => {
            this.setState({ loading: false });
        });
    }

    updateStatus = (id, status) => {
        let st = this.props.status.find(el => el.status === status);
        if (confirm('Bạn có chắc muốn ' + st.name)) {
            if (st) {
                this.props.updateStatus(id, st).then(code => {
                    if (code === 200) {
                        this.loadMarks();
                    }
                });
            }
        }
    }
    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption, statusFilter: statusSelectedOption.value, page: 1 }, this.pushUrl);
    }

    handleChangeYear = (yearSelectedOption) => {
        this.setState({ yearSelectedOption, yearFilter: yearSelectedOption.value, page: 1 }, this.pushUrl);
    }

    handleChangeSchool = (s) => {
        $('#modal-school').modal('hide');
        this.setState({
            schoolFilter: s.id,
            majorFilter: undefined,
            major: [],
            pageMajor: 1,
            page: 1
        }, this.pushUrl);
    }

    handleChangeMajor = (s) => {
        $('#modal-major').modal('hide');
        this.setState({
            majorFilter: s.id,
            page: 1
        }, this.pushUrl);
    }

    toggleSchool = () => {
        if (this.state.school.length === 0) {
            this.loadSchools(this.state.pageSchool);
        }
        $('#modal-school').modal('toggle');
    }

    toggleMajor = () => {
        if (this.state.major.length === 0) {
            this.loadMajors(this.state.pageMajor);
        }
        $('#modal-major').modal('toggle');
    }

    render() {
        return (
            <Fragment>
                {this.state.loading && (<div id="my-loading">
                    <i className="fa fa-fw fa-5x fa-spinner faa-spin animated"></i>
                </div>)}
                {/* Modal school -> select school */}
                <div className="modal fade" id="modal-school">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Trường</h4>
                            </div>
                            <div className="modal-body">
                                <div className="list-group">
                                    {this.genListSchool()}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <ul className="pagination pagination-md no-margin pull-right">
                                    <li className={this.state.pageSchool === 1 ? 'disabled' : ''}>
                                        <a href="#" onClick={(e) => this.newPageSchool(e, -1)}>Pre</a>
                                    </li>
                                    <li className="active">
                                        <a>{this.state.pageSchool}</a>
                                    </li>
                                    <li className={this.state.nextSchool ? '' : 'disabled'}>
                                        <a href="#" onClick={(e) => this.newPageSchool(e, 1)} >Next</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* /.modal-content */}
                    </div>
                    {/* /.modal-dialog */}
                </div>

                {/* Modal Major -> select major */}
                <div className="modal fade" id="modal-major">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Ngành</h4>
                            </div>
                            <div className="modal-body">
                                <div className="list-group">
                                    {this.genListMajor()}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <ul className="pagination pagination-md no-margin pull-right">
                                    <li className={this.state.pageMajor === 1 ? 'disabled' : ''}>
                                        <a href="#" onClick={(e) => this.newPageMajor(e, -1)}>Pre</a>
                                    </li>
                                    <li className="active">
                                        <a>{this.state.pageMajor}</a>
                                    </li>
                                    <li className={this.state.nextMajor ? '' : 'disabled'}>
                                        <a href="#" onClick={(e) => this.newPageMajor(e, 1)} >Next</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* /.modal-content */}
                    </div>
                    {/* /.modal-dialog */}
                </div>

                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý Điểm Chuẩn
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Mark</a></li>
                        <li className="active">List</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box">
                                <div className="box-header">
                                    <div className="col-xs-12 col-lg-4 lh-35">
                                        <h3 className="box-title">Danh sách điểm chuẩn</h3>
                                    </div>
                                    <div className="col-xs-12 col-lg-8">
                                        <div className="row">
                                            <div className="col-xs-12 col-lg-3">
                                                <div className="form-group">
                                                    <Select
                                                        styles={selectStyle}
                                                        isSearchable={false}
                                                        onChange={this.handleChangeYear}
                                                        options={this.state.yearOptions}
                                                        value={this.state.yearSelectedOption}
                                                        placeholder="Năm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-lg-3">
                                                <div className="form-group">
                                                    <div
                                                        className="h-hand"
                                                        onClick={this.toggleSchool}
                                                    >
                                                        <Select
                                                            isSearchable={false}
                                                            styles={{ ...selectStyle, menu: () => ({ display: 'none' }) }}
                                                            value={this.state.schoolSelectedOption}
                                                            placeholder="Trường"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-lg-3">
                                                <div className="form-group">
                                                    <div
                                                        className="h-hand"
                                                        onClick={this.toggleMajor}
                                                    >
                                                        <Select
                                                            isSearchable={false}
                                                            styles={{ ...selectStyle, menu: () => ({ display: 'none' }) }}
                                                            value={this.state.majorSelectedOption}
                                                            placeholder="Ngành"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-lg-3">
                                                <div className="form-group">
                                                    <Select
                                                        styles={selectStyle}
                                                        isSearchable={false}
                                                        onChange={this.handleChangeStatus}
                                                        options={this.state.statusOptions}
                                                        value={this.state.statusSelectedOption}
                                                        placeholder="Trạng thái"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body table-responsive no-padding">
                                    <table className="table table-hover">
                                        <tbody>
                                            <tr>
                                                <th>Trường</th>
                                                <th>Ngành</th>
                                                <th className="text-center">Năm</th>
                                                <th className="text-center">Nguyện vọng</th>
                                                <th>Điểm Chuẩn</th>
                                                <th className="text-center">Tổ Hợp Môn</th>
                                                <th>Ghi Chú</th>
                                                {(this.state.delete || this.state.update) &&
                                                    <th width="15%" className="text-center">Action</th>
                                                }
                                            </tr>
                                            {this.genListMark()}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <!-- /.box-body --> */}
                                <div className="box-footer clearfix">
                                    <ul className="pagination pagination-md no-margin pull-right">
                                        <li className={this.state.page === 1 ? 'disabled' : ''}>
                                            <a href="#" onClick={(e) => this.newPage(e, -1)}>Pre</a>
                                        </li>
                                        <li className="active">
                                            <a>{this.state.page}</a>
                                        </li>
                                        <li className={this.state.next ? '' : 'disabled'}>
                                            <a href="#" onClick={(e) => this.newPage(e, 1)} >Next</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* <!-- /.box --> */}
                        </div>
                    </div>
                </section>
                {/* /.content */}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.MarkReducer,
        user: state.LoginReducer.user,
        status: state.StatusReducer.status,
        session: state.LoginReducer.session
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadMarks: (page, statusFilter, schoolFilter, majorFilter, yearFilter) => dispatch(actions.loadAllMarkApi(page, statusFilter, schoolFilter, majorFilter, yearFilter)),
        updateStatus: (id, status) => dispatch(actions.updateStatusApi(id, status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Mark);
