import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/MajorActions';
import toastr from 'toastr';
import MajorItem from './MajorItem';
import { findRole } from './../../custom/CusFunction';
import * as roles from './../../contants/roles';
import { toastrOption, selectStyle } from './../../custom/Custom';
import * as status from './../../contants/status';
import Select from 'react-select';
import SchoolApi from './../../api/SchoolApi';
import * as qs from 'query-string';

class Major extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            next: true,
            majors: [],
            update: false,
            delete: false,
            statusSelectedOption: null,
            schoolSelectedOption: null,
            schoolOptions: [],
            statusOptions: [],

            statusFilter: undefined,
            schoolFilter: undefined,
            pageSchool: 1,
            nextSchool: false,
            school: [],

            loading: false
        }

        toastr.options = toastrOption;
    }

    async componentDidMount() {
        await this.initStatusOptions(this.props);
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadMajors();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadMajors();
        }
        if (this.props.status !== nextProps.status) {
            await this.initStatusOptions(nextProps);
            this.initSelectedOption();
        }
        let { majors, next } = nextProps.data;
        let { user } = nextProps;
        let update = findRole(user.role, roles.UPDATE) !== -1, del = findRole(user.role, roles.DELETE) !== -1;
        this.setState({ majors, next, update, delete: del });
    }

    initFilter = filter => {
        let { page, statusFilter, schoolFilter } = filter;
        // valid page
        page = Number(page) || 1;
        page = page < 0 ? 1 : page;
        this.setState({ page, statusFilter, schoolFilter }, this.initSelectedOption);
    }

    initSelectedOption = async () => {
        let { statusFilter, statusOptions, schoolFilter } = this.state;
        let statusSelectedOption = statusOptions ? statusOptions.find(el => el.value === statusFilter) : undefined;
        // load school selected
        let { session } = this.props;
        let schoolSelectedOption;
        if (schoolFilter) {
            let s = await SchoolApi.getOne({ session, id: schoolFilter });
            schoolSelectedOption = s.body.code === 200 ? { label: s.body.data.name } : undefined;
        }
        this.setState({ statusSelectedOption, schoolSelectedOption });
    }

    pushUrl = () => {
        let { page, statusFilter, schoolFilter } = this.state;
        let query = '?';
        query += page ? ('page=' + page) : '';
        query += statusFilter ? ('&statusFilter=' + statusFilter) : '';
        query += schoolFilter ? ('&schoolFilter=' + schoolFilter) : '';
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

    genListMajor = () => {
        let { majors } = this.state;
        let rs = null;
        if (majors) {
            rs = majors.map((major, index) => {
                return (
                    <MajorItem
                        key={index}
                        major={major}
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

    updateStatus = (id, status) => {
        let st = this.props.status.find(el => el.status === status);
        if (confirm('Bạn có chắc muốn ' + st.name)) {
            if (st) {
                this.props.updateStatus(id, st).then(code => {
                    if (code === 200) {
                        this.loadMajors(this.state.page);
                    }
                });
            }
        }
    }

    loadMajors = () => {
        this.setState({ loading: true });
        let { page, statusFilter, schoolFilter } = this.state;
        this.props.loadMajors(page, statusFilter, schoolFilter).then(res => {
            this.setState({ loading: false });
        });
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption, statusFilter: statusSelectedOption.value, page: 1 }, this.pushUrl);
    }

    handleChangeSchool = (s) => {
        $('#modal-school').modal('hide');
        this.setState({
            schoolFilter: s.id,
            page: 1
        }, this.pushUrl);
    }

    toggleSchool = () => {
        if (this.state.school.length === 0) {
            this.loadSchools(this.state.pageSchool);
        }
        $('#modal-school').modal('toggle');
    }

    render() {

        return (
            <Fragment>
                {this.state.loading && (<div id="my-loading">
                    <i className="fa fa-fw fa-5x fa-spinner faa-spin animated"></i>
                </div>)}
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

                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý Ngành
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Major</a></li>
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
                                        <h3 className="box-title">Danh sách Ngành</h3>
                                    </div>
                                    <div className="col-xs-12 col-lg-8">
                                        <div className="row">
                                            <div className="col-xs-12 col-lg-offset-4 col-lg-4">
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
                                            <div className="col-xs-12 col-lg-4">
                                                <div className="form-group">
                                                    <Select
                                                        isSearchable={false}
                                                        styles={selectStyle}
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
                                                <th>Tên Ngành</th>
                                                <th>Mã Ngành</th>
                                                <th>Trường</th>
                                                {(this.state.delete || this.state.update) &&
                                                    <th width="15%" className="text-center">Action</th>
                                                }
                                            </tr>
                                            {this.genListMajor()}
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
        data: state.MajorReducer,
        user: state.LoginReducer.user,
        status: state.StatusReducer.status,
        session: state.LoginReducer.session
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadMajors: (page, statusFilter, schoolFilter) => dispatch(actions.loadAllMajorApi(page, statusFilter, schoolFilter)),
        updateStatus: (id, status) => dispatch(actions.updateStatusApi(id, status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Major);