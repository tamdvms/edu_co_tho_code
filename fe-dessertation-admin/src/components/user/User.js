import React, { Component, Fragment } from 'react';
import UserItem from './UserItem';
import { connect } from 'react-redux';
import * as actions from './../../actions/UserActions';
import toastr from 'toastr';
import { toastrOption, selectStyle } from './../../custom/Custom';
import * as status from './../../contants/status';
import Select from 'react-select';
import RoleApi from './../../api/RoleApi';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as qs from 'query-string';

const locale = {
    applyLabel: 'Đồng ý',
    cancelLabel: 'Hủy',
    format: 'DD/MM/YYYY',
    daysOfWeek: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    monthNames: [
        'Tháng 1,',
        'Tháng 2,',
        'Tháng 3,',
        'Tháng 4,',
        'Tháng 5,',
        'Tháng 6,',
        'Tháng 7,',
        'Tháng 8,',
        'Tháng 9,',
        'Tháng 10,',
        'Tháng 11,',
        'Tháng 12,'
    ]
}

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            next: false,
            users: [],
            statusSelectedOption: undefined,
            statusOptions: [],
            statusFilter: undefined,
            roleSelectedOption: undefined,
            roleOptions: [],
            roleFilter: undefined,

            dateFilter: undefined,
            dateSelectedOption: undefined,

            loading: false
        }
        toastr.options = toastrOption;
    }

    async componentDidMount() {
        await this.initStatusOptions(this.props);
        await this.initRoleOptions();
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadUsers();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadUsers();
        }
        if (this.props.status !== nextProps.status) {
            await this.initStatusOptions(nextProps);
            this.initSelectedOption();
        }
        let { users, next } = nextProps.data;
        this.setState({ users, next });
    }

    initFilter = (filter) => {
        let { page, statusFilter, roleFilter, start, end } = filter;
        page = Number(page) || 1;
        page = page < 0 ? 1 : page;
        // valid start, end
        start = Number(start) ? new Date(Number(start)) : new Date(1001, 1, 1);
        end = Number(end) ? new Date(Number(end)) : new Date();
        this.setState({ page, statusFilter, roleFilter, dateFilter: { start, end } }, this.initSelectedOption);
    }

    initSelectedOption = () => {
        let { statusFilter, roleFilter, statusOptions, roleOptions, dateFilter } = this.state;
        let statusSelectedOption = statusOptions ? statusOptions.find(el => el.value === statusFilter) : undefined;
        let roleSelectedOption = roleOptions ? roleOptions.find(el => el.value === roleFilter) : undefined;
        let dateSelectedOption = dateFilter ? { label: this.convert(dateFilter.start) + ' - ' + this.convert(dateFilter.end) } : undefined;
        this.setState({ statusSelectedOption, roleSelectedOption, dateSelectedOption });
    }

    pushUrl = () => {
        let { page, statusFilter, roleFilter, dateFilter } = this.state;
        let query = '?';
        query += page ? ('page=' + page) : '';
        query += statusFilter ? ('&statusFilter=' + statusFilter) : '';
        query += roleFilter ? ('&roleFilter=' + roleFilter) : '';
        query += dateFilter ? ('&start=' + dateFilter.start.getTime()) : '';
        query += dateFilter ? ('&end=' + dateFilter.end.getTime()) : '';
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

    initRoleOptions = async () => {
        // get all sector in database
        let next = true, rs = [], tmp, page = 1;
        while (next) {
            tmp = await RoleApi.getAll({
                page: page++,
                session: this.props.session
            });
            rs = rs.concat(tmp.body.data.list);
            next = tmp.body.data.next;
        }
        let roleOptions = [{ value: undefined, label: 'Tất cả' }, ...rs.map(el => ({ value: el.id, label: el.name }))];
        this.setState({ roleOptions });
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

    genListUser = () => {
        let { users } = this.state;
        let rs = null;
        if (users) {
            rs = users.map((user, index) => {
                return (
                    <UserItem
                        key={index}
                        user={user}
                        updateStatus={this.updateStatus}
                    />
                );
            });
        }
        return rs;
    }

    updateStatus = (id, status) => {
        let st = this.props.status.find(el => el.status === status);
        if (confirm('Bạn có chắc muốn ' + st.name)) {
            if (st) {
                this.props.updateStatus(id, st).then(code => {
                    if (code === 200) {
                        this.loadUsers();
                    }
                });
            }
        }
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusFilter: statusSelectedOption.value, page: 1 }, this.pushUrl);
    }

    handleChangeRole = (roleSelectedOption) => {
        this.setState({ roleFilter: roleSelectedOption.value, page: 1 }, this.pushUrl);
    }

    loadUsers = () => {
        this.setState({ loading: true });
        var { page, statusFilter, roleFilter, dateFilter } = this.state;
        this.props.loadUsers(page, statusFilter, roleFilter, dateFilter).then(res => {
            console.log(res);
            this.setState({ loading: false });
        });
    }

    handleDatePick = (event, picker) => {
        let start = picker.startDate._d;
        let end = picker.endDate._d;
        // let start = new Date(picker.startDate._d.getFullYear(), picker.startDate._d.getMonth(), picker.startDate._d.getDate());
        // let end = new Date(picker.endDate._d.getFullYear(), picker.endDate._d.getMonth(), picker.endDate._d.getDate());
        // console.log(start.toISOString());
        this.setState({
            dateFilter: { start, end },
            page: 1
        }, this.pushUrl);
    }

    convert = (date) => {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }

    render() {

        return (
            <Fragment>
                {this.state.loading && (<div id="my-loading">
                    <i className="fa fa-fw fa-5x fa-spinner faa-spin animated"></i>
                </div>)}
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý Người Dùng
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> User</a></li>
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
                                        <h3 className="box-title">Danh sách người dùng</h3>
                                    </div>
                                    <div className="col-xs-12 col-lg-8">
                                        <div className="row">
                                            <div className="col-xs-12 col-lg-6">
                                                <div className="form-group">
                                                    <DateRangePicker
                                                        locale={locale}
                                                        onApply={this.handleDatePick}
                                                        containerStyles={{ display: 'block' }}
                                                        autoUpdateInput
                                                    >
                                                        <Select
                                                            styles={{ ...selectStyle, menu: () => ({ display: 'none' }) }}
                                                            isSearchable={false}
                                                            placeholder="Ngày"
                                                            value={this.state.dateSelectedOption}
                                                        />
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-lg-3">
                                                <div className="form-group">
                                                    <Select
                                                        styles={selectStyle}
                                                        isSearchable={false}
                                                        onChange={this.handleChangeRole}
                                                        options={this.state.roleOptions}
                                                        value={this.state.roleSelectedOption}
                                                        placeholder="Quyền"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-lg-3">
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
                                                <th>Tài khoản</th>
                                                <th>Tên</th>
                                                <th>Quyền</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                            {this.genListUser()}
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
        data: state.UserReducer,
        status: state.StatusReducer.status,
        session: state.LoginReducer.session
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadUsers: (page, status, role, date) => dispatch(actions.loadAllUserApi(page, status, role, date)),
        updateStatus: (id, status) => dispatch(actions.updateStatusApi(id, status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);