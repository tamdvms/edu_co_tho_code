import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/MediaActions';
import toastr from 'toastr';
import { toastrOption, selectStyle } from './../../custom/Custom';
import { findRole } from './../../custom/CusFunction';
import * as roles from './../../contants/roles';
import Select from 'react-select';
import * as qs from 'query-string';
import MediaItem from './MediaItem';

class Media extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            next: true,
            medias: [],
            update: false,
            delete: false,
            statusSelectedOption: undefined,
            statusOptions: [],
            statusFilter: undefined,
            loading: false,
            kindFilter: undefined
        }
        toastr.options = toastrOption;
    }

    async componentDidMount() {
        await this.initStatusOptions(this.props);
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadMedias();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadMedias();
        }
        if (this.props.status !== nextProps.status) {
            await this.initStatusOptions(nextProps);
            this.initSelectedOption();
        }
        let { medias, next } = nextProps.data;
        let { user } = nextProps;
        let update = findRole(user.role, roles.UPDATE) !== -1, del = findRole(user.role, roles.DELETE) !== -1;
        this.setState({ medias, next, update, delete: del });
    }

    initFilter = filter => {
        let { statusFilter, page, kindFilter } = filter;
        page = Number(page) || 1;
        page = page < 0 ? 1 : page;
        this.setState({ statusFilter, page, kindFilter }, this.initSelectedOption);
    }

    initStatusOptions = props => {
        if (props.status && props.status.length !== 0) {
            let statusOptions = [{ value: undefined, label: 'Tất cả' }, ...props.status.map(el => ({ value: el.id, label: el.name }))];
            this.setState({
                statusOptions
            });
        }
    }

    initSelectedOption = () => {
        let { statusFilter, statusOptions } = this.state;
        let statusSelectedOption = statusOptions ? statusOptions.find(el => el.value === statusFilter) : undefined;
        this.setState({ statusSelectedOption });
    }

    pushUrl = () => {
        let { page, statusFilter, kindFilter } = this.state;
        let query = '?';
        query += page ? ('page=' + page) : '';
        query += statusFilter ? ('&statusFilter=' + statusFilter) : '';
        query += kindFilter ? ('&kindFilter=' + kindFilter) : '';
        this.props.history.push(this.props.location.pathname + query);
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

    genListMedia = () => {
        let rs = null, { medias } = this.state;
        if (medias) {
            rs = medias.map((media, index) => {
                return (
                    <MediaItem
                        index={index}
                        key={index}
                        media={media}
                        updateStatus={this.updateStatus}
                        update={this.state.update}
                        delete={this.state.delete}
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
                        this.loadMedias();
                    }
                });
            }
        }
    }

    loadMedias = () => {
        this.setState({ loading: true });
        let { statusFilter, kindFilter, page } = this.state;
        this.props.loadMedias(page, kindFilter, statusFilter).then(res => {
            this.setState({ loading: false });
        });
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        let statusFilter = statusSelectedOption.value;
        this.setState({ statusFilter, page: 1 }, this.pushUrl);
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
                        Trang Quản Lý Media
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> New</a></li>
                        <li className="active">List</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box">
                                <div className="box-header">
                                    <div className="row">
                                        <div className="col-xs-12 col-lg-4 lh-35">
                                            <h3 className="box-title">Danh sách Media</h3>
                                        </div>
                                        <div className="col-xs-12 col-lg-8">
                                            <div className="row">
                                                <div className="col-xs-12 col-lg-offset-8 col-lg-4">
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
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body table-responsive no-padding">
                                    <table className="table table-hover">
                                        <tbody>
                                            <tr>
                                                <th>Demo</th>
                                                <th>
                                                    Link
                                                </th>
                                                <th>Loại</th>
                                                {(this.state.delete || this.state.update) &&
                                                    <th className="text-center">Action</th>
                                                }
                                            </tr>
                                            {this.genListMedia()}
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
        data: state.MediaReducer,
        user: state.LoginReducer.user,
        status: state.StatusReducer.status
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadMedias: (page, kindFilter, statusFilter) => dispatch(actions.loadListApi(page, kindFilter, statusFilter)),
        updateStatus: (id, status) => dispatch(actions.updateStatusApi(id, status))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Media);