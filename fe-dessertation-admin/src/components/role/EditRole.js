import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import Select from 'react-select';
import * as roles from './../../contants/roles';
import * as roleAction from './../../actions/RoleActions';
import RoleApi from './../../api/RoleApi';
import StatusApi from '../../api/StatusApi';
import { selectStyle, toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';

class EditRole extends Component {

    constructor(props) {
        super(props);

        this.init = {
            role: {
                id: undefined,
                name: '',
                roles: [],
                status: ''
            },
            isProcess: false,
            statusSelectedOption: null,
            roleSelectedOption: null,

            invalid: false
        }

        this.state = {
            isUpdate: false,
            roleOptions: [
                {
                    value: roles.VIEW,
                    label: 'VIEW'
                },
                {
                    value: roles.ADD,
                    label: 'ADD'
                },
                {
                    value: roles.UPDATE,
                    label: 'UPDATE'
                },
                {
                    value: roles.DELETE,
                    label: 'DELETE'
                },
                {
                    value: roles.ROOT,
                    label: 'ROOT'
                }
            ],
            statusOptions: [],
            ...this.init
        }

        toastr.options = toastrOption;
    }

    async componentDidMount() {
        this.props.changeLoading(true);
        await this.updateAction(this.props);
        this.props.changeLoading(false);
    }

    componentWillReceiveProps(nextProps) {
        this.updateAction(nextProps);
    }

    loadStatusOption = async () => {
        // lấy tất cả status trong db
        let next = true, rs = [], tmp, page = 1;
        while (next) {
            tmp = await StatusApi.getAll({
                page: page++,
                session: this.props.session
            });
            rs = rs.concat(tmp.body.data.list);
            next = tmp.body.data.next;
        }
        this.setState({
            statusOptions: rs.map(el => ({ value: el.id, label: el.name }))
        });
    }

    updateAction = async (props) => {
        let isUpdate = props.do === 'update' ? true : false;
        this.setState({ isUpdate });
        await this.loadStatusOption();
        if (isUpdate) {
            RoleApi.getOne({
                id: props.match.params.id,
                session: this.props.session
            }).then(res => {
                let role = res.body.data;
                if (role) {
                    role.roles = JSON.parse(role.roles);
                    let roleSelectedOption = [];
                    for (let i = 0; i < role.roles.length; i++) {
                        roleSelectedOption = roleSelectedOption.concat(this.state.roleOptions.filter(el => el.value === role.roles[i]));
                    }
                    this.setState({
                        roleSelectedOption,
                        statusSelectedOption: this.state.statusOptions.filter(el => el.value === role.status),
                        role
                    });
                }
            }).catch(error => {
                throw (error);
            });
        } else {
            this.renewForm();
        }
    }

    renewForm = () => {
        let { statusOptions } = this.state;
        this.setState(preState => ({
            ...preState,
            ...this.init,
            role: {
                ...preState.role,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            role: {
                ...preState.role,
                [name]: value
            }
        }));
    }

    handleSave = (e) => {
        e.preventDefault();
        this.setState({
            isProcess: true
        });
        let invalid = this.checkInput();
        if (invalid) {
            this.setState({ isProcess: false, invalid });
            return;
        }
        let { role } = this.state;
        if (role.id) {
            this.props.updateRole(role).then(code => {
                if (code === 200) {
                    toastr.success('Updated!');
                } else {
                    toastr.error('Error! ' + code);
                }
                this.setState({
                    isProcess: false
                });
            });
        } else {
            this.props.addRole(role).then(code => {
                if (code === 200) {
                    toastr.success('Added!');
                } else {
                    toastr.error('Error! ' + code);
                }
                this.setState({
                    isProcess: false
                });
                this.renewForm();
            });
        }
    }

    handleChangeRole = (roleSelectedOption) => {
        this.setState({ roleSelectedOption });
        let { role } = this.state;
        role.roles = roleSelectedOption.map(el => el.value);
        this.setState({
            role
        });
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption });
        let { role } = this.state;
        role.status = statusSelectedOption.value
        this.setState({
            role
        });
    }

    checkInput = () => {
        let { role } = this.state;
        return role.name === '' || role.status === '' || role.roles.length === 0;
    }

    render() {
        let { role } = this.state;
        return (
            <Fragment>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý
                        <small>Phân Quyền</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Role</a></li>
                        <li className="active">{this.state.isUpdate ? 'update' : 'add'}</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">{(this.state.isUpdate ? 'Cập nhật' : 'Thêm') + ' phân quyền'}</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                            {this.state.invalid && <p>Vui lòng không bỏ trống các trường có dấu (*)</p>}
                                        </div>
                                        <div className="col-xs-12">
                                            <div className="form-group">
                                                <label htmlFor="name">Tên Quyền (*)</label>
                                                <input
                                                    value={role.name}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.role.name === '' ? ' cus-error' : '')}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Tên Quyền (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description">Quyền (*)</label>
                                                <div
                                                    className={this.state.invalid && this.state.role.roles.length === 0 ? 'cus-error' : ''}
                                                    onClick={() => this.setState({ invalid: false })}
                                                >
                                                    <Select
                                                        isMulti={true}
                                                        styles={selectStyle}
                                                        onChange={this.handleChangeRole}
                                                        options={this.state.roleOptions}
                                                        value={this.state.roleSelectedOption}
                                                        placeholder="Quyền (*)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="status">Trạng thái (*)</label>
                                                <Select
                                                    styles={selectStyle}
                                                    onChange={this.handleChangeStatus}
                                                    options={this.state.statusOptions}
                                                    value={this.state.statusSelectedOption}
                                                    placeholder="Trạng thái (*)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-6 col-md-3 col-xs-offset-6 col-md-offset-9">
                                            <button
                                                className="btn btn-block btn-primary btn-flat"
                                                onClick={(e) => this.handleSave(e)}
                                                disabled={this.state.isProcess}
                                            >
                                                Lưu lại  {this.state.isProcess ? (<i className="fa fa-spinner faa-spin animated"></i>) : ''}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- /.box-body --> */}
                            </div>
                        </div>
                    </div>
                </section>
                {/* /.content */}
            </Fragment>
        );
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        addRole: role => dispatch(roleAction.addRoleApi(role)),
        updateRole: role => dispatch(roleAction.updateRoleApi(role)),
        changeLoading: loading => dispatch(changeLoading(loading))
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRole);