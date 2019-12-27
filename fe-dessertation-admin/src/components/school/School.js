import React, { Component, Fragment } from 'react';
import SchoolItem from './SchoolItem';
import { connect } from 'react-redux';
import * as actions from '../../actions/SchoolActions';
import toastr from 'toastr';
import { findRole } from './../../custom/CusFunction';
import * as roles from './../../contants/roles';
import { toastrOption, selectStyle } from './../../custom/Custom';
import * as status from './../../contants/status';
import ProvinceApi from './../../api/ProvinceApi';
import Select from 'react-select';
import * as qs from 'query-string';

class School extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            next: true,
            schools: [],
            update: false,
            delete: false,

            statusSelectedOption: null,
            statusOptions: [],

            statusFilter: undefined,
            provinceFilter: undefined,
            pageProvince: 1,
            province: [],
            nextProvince: false,

            loading: false
        }

        toastr.options = toastrOption;
    }

    async componentDidMount() {
        await this.initStatusOptions(this.props);
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadSchools();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadSchools();
        }
        if (this.props.status !== nextProps.status) {
            await this.initStatusOptions(nextProps);
            this.initSelectedOption();
        }
        let { schools, next } = nextProps.data;
        let { user } = nextProps;
        let update = findRole(user.role, roles.UPDATE) !== -1, del = findRole(user.role, roles.DELETE) !== -1;
        this.setState({
            schools,
            next,
            update,
            delete: del
        });
    }

    initFilter = (filter) => {
        let { page, statusFilter, provinceFilter } = filter;
        page = Number(page) || 1;
        page = page < 0 ? 1 : page;
        this.setState({ page, statusFilter, provinceFilter }, this.initSelectedOption);
    }

    initSelectedOption = async () => {
        let { statusFilter, provinceFilter, statusOptions } = this.state;
        let statusSelectedOption = statusOptions ? statusOptions.find(el => el.value === statusFilter) : undefined;
        let provinceSelectedOption;
        if (provinceFilter) {
            let { session } = this.props;
            let pro = await ProvinceApi.getOne({
                session, id: provinceFilter
            });
            provinceSelectedOption = pro.body.code === 200 ? { value: pro.body.data.value, label: pro.body.data.name } : undefined;
        }
        this.setState({ statusSelectedOption, provinceSelectedOption });
    }

    pushUrl = () => {
        let { page, statusFilter, provinceFilter } = this.state;
        let query = '?';
        query += page ? ('page=' + page) : '';
        query += statusFilter ? ('&statusFilter=' + statusFilter) : '';
        query += provinceFilter ? ('&provinceFilter=' + provinceFilter) : '';
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

    loadProvinces = async page => {
        let rs = await ProvinceApi.getAll({
            page,
            session: this.props.session
        });

        this.setState({
            province: [{ id: undefined, name: 'Tất cả' }, ...rs.body.data.list],
            nextProvince: rs.body.data.next,
            pageProvince: page
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

    newPageProvince = (e, num) => {
        e.preventDefault();
        let { pageProvince, nextProvince } = this.state;
        pageProvince += num;
        if (pageProvince === 0 || (!nextProvince && num > 0)) {
            return;
        } else {
            this.loadProvinces(pageProvince);
        }
    }

    genListSchool = () => {
        let { schools } = this.state;
        let rs = null;
        if (schools) {
            rs = schools.map((school, index) => {
                return (
                    <SchoolItem
                        key={index}
                        school={school}
                        updateStatus={this.updateStatus}
                        delete={this.state.delete}
                        update={this.state.update}
                    />
                );
            });
        }
        return rs;
    }

    genListProvince = () => {
        let { province } = this.state;
        let rs = null;
        rs = province.map((p, i) => (
            <a
                key={i}
                className={"list-group-item h-hand " + (p.id === this.state.provinceFilter ? 'active' : '')}
                onClick={() => this.handleChangeProvince(p)}
            >{p.name}</a>
        ));
        return rs;
    }

    updateStatus = (id, status) => {
        let st = this.props.status.find(el => el.status === status);
        if (confirm('Bạn có chắc muốn ' + st.name)) {
            if (st) {
                this.props.updateStatus(id, st).then(code => {
                    if (code === 200) {
                        this.loadSchools();
                    }
                });
            }
        }
    }

    loadSchools = () => {
        this.setState({ loading: true });
        let { page, statusFilter, provinceFilter } = this.state;
        this.props.loadSchools(page, statusFilter, provinceFilter).then(res => {
            this.setState({ loading: false });
        });
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption, statusFilter: statusSelectedOption.value, page: 1 }, this.pushUrl);
    }

    handleChangeProvince = (s) => {
        $('#modal-province').modal('hide');
        this.setState({
            provinceFilter: s.id,
            page: 1
        }, this.pushUrl);
    }

    toggleProvince = () => {
        if (this.state.province.length === 0) {
            this.loadProvinces(this.state.pageProvince);
        }
        $('#modal-province').modal('toggle');
    }

    render() {
        return (
            <Fragment>
                {this.state.loading && (<div id="my-loading">
                    <i className="fa fa-fw fa-5x fa-spinner faa-spin animated"></i>
                </div>)}
                <div className="modal fade" id="modal-province">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Tỉnh</h4>
                            </div>
                            <div className="modal-body">
                                <div className="list-group">
                                    {this.genListProvince()}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <ul className="pagination pagination-md no-margin pull-right">
                                    <li className={this.state.pageProvince === 1 ? 'disabled' : ''}>
                                        <a href="#" onClick={(e) => this.newPageProvince(e, -1)}>Pre</a>
                                    </li>
                                    <li className="active">
                                        <a>{this.state.pageProvince}</a>
                                    </li>
                                    <li className={this.state.nextProvince ? '' : 'disabled'}>
                                        <a href="#" onClick={(e) => this.newPageProvince(e, 1)} >Next</a>
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
                        Trang Quản Lý Trường
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> School</a></li>
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
                                        <h3 className="box-title">Danh sách Trường</h3>
                                    </div>
                                    <div className="col-xs-12 col-lg-8">
                                        <div className="row">
                                            <div className="col-xs-12 col-lg-offset-4 col-lg-4">
                                                <div className="form-group">
                                                    <div
                                                        className="h-hand"
                                                        onClick={this.toggleProvince}
                                                    >
                                                        <Select
                                                            isSearchable={false}
                                                            styles={{ ...selectStyle, menu: () => ({ display: 'none' }) }}
                                                            value={this.state.provinceSelectedOption}
                                                            placeholder="Tỉnh"
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
                                                <th>Logo</th>
                                                <th>Tên Trường</th>
                                                <th>Mã Trường</th>
                                                <th>Mô tả</th>
                                                <th>Tỉnh</th>
                                                {(this.state.delete || this.state.update) &&
                                                    <th width="15%" className="text-center">Action</th>
                                                }
                                            </tr>
                                            {this.genListSchool()}
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
        data: state.SchoolReducer,
        user: state.LoginReducer.user,
        status: state.StatusReducer.status,
        session: state.LoginReducer.session
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadSchools: (page, statusFilter, provinceFilter) => dispatch(actions.loadAllSchoolApi(page, statusFilter, provinceFilter)),
        updateStatus: (id, status) => dispatch(actions.updateStatusApi(id, status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(School);