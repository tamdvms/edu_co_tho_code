import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import * as subjectGroupAction from './../../actions/SubjectGroupActions';
import SubjectGroupApi from './../../api/SubjectGroupApi';
import SubjectApi from './../../api/SubjectApi';
import Select from 'react-select';
import { selectStyle, toastrOption } from './../../custom/Custom';
import StatusApi from '../../api/StatusApi';
import { changeLoading } from './../../actions/DifActions';

class EditSubjectGroup extends Component {

    constructor(props) {
        super(props);

        this.init = {
            subjectGroup: {
                code: '',
                description: '',
                id: undefined,
                subjects: [],
                status: ''
            },
            isProcess: false,
            subjectSelectedOption: [],
            statusSelectedOption: null,
        }

        this.state = {
            isUpdate: false,
            subjectOptions: [],
            statusOptions: [],
            ...this.init,

            invalid: false
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

    loadSubjectOption = async () => {
        // get all subject in database
        let next = true, rs = [], tmp, page = 1;
        while (next) {
            tmp = await SubjectApi.getAll({
                page: page++,
                session: this.props.session
            });
            rs = rs.concat(tmp.body.data.list);
            next = tmp.body.data.next;
        }
        this.setState({
            subjectOptions: rs.map(el => ({ value: el.id, label: el.name }))
        });
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
        await this.loadSubjectOption();
        //
        if (isUpdate) {
            SubjectGroupApi.getOne({
                id: props.match.params.id,
                session: this.props.session
            }).then(res => {
                let subjectGroup = res.body.data;
                if (subjectGroup) {
                    subjectGroup.subjects = JSON.parse(subjectGroup.subjects);
                    let subjectSelectedOption = [];
                    for (let i = 0; i < subjectGroup.subjects.length; i++) {
                        subjectSelectedOption = subjectSelectedOption.concat(this.state.subjectOptions.filter(el => el.value === subjectGroup.subjects[i]));
                    }
                    this.setState({
                        subjectSelectedOption,
                        statusSelectedOption: this.state.statusOptions.filter(el => el.value === subjectGroup.status),
                        subjectGroup
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
            subjectGroup: {
                ...preState.subjectGroup,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            subjectGroup: {
                ...preState.subjectGroup,
                [name]: value
            }
        }));
    }

    handleSave = (e) => {
        this.setState({
            isProcess: true
        });
        e.preventDefault();
        let invalid = this.checkInput();
        if (invalid) {
            this.setState({ isProcess: false, invalid });
            return;
        }
        let { subjectGroup } = this.state;
        if (subjectGroup.id) {
            this.props.updateSubjectGroup(subjectGroup).then(code => {
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
            this.props.addSubjectGroup(subjectGroup).then(code => {
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

    handleChangeSubject = (subjectSelectedOption) => {
        this.setState({ subjectSelectedOption });
        let { subjectGroup } = this.state;
        subjectGroup.subjects = subjectSelectedOption.map(el => el.value);
        this.setState({
            subjectGroup
        });
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption });
        let { subjectGroup } = this.state;
        subjectGroup.status = statusSelectedOption.value
        this.setState({
            subjectGroup
        });
    }

    checkInput = () => {
        let { subjectGroup } = this.state;
        return subjectGroup.code === '' || subjectGroup.status === '' || subjectGroup.subjects.length === 0;
    }

    render() {
        let { subjectGroup } = this.state;
        return (
            <Fragment>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý
                        <small>Tổ Hợp Môn Thi</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> SubjectGroup</a></li>
                        <li className="active">{this.state.isUpdate ? 'update' : 'add'}</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">{(this.state.isUpdate ? 'Cập nhật' : 'Thêm') + ' tổ hợp môn'}</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                            {this.state.invalid && <p>Vui lòng không bỏ trống các trường có dấu (*)</p>}
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="code">Mã tổ hợp môn (*)</label>
                                                <input
                                                    value={subjectGroup.code}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.subjectGroup.code === '' ? ' cus-error' : '')}
                                                    id="code"
                                                    name="code"
                                                    placeholder="Mã tổ hợp môn (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description">Mô tả</label>
                                                <input
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Mô tả"
                                                    value={subjectGroup.description}
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="subject">Môn (*)</label>
                                                <div
                                                    className={this.state.invalid && this.state.subjectGroup.subjects.length === 0 ? 'cus-error' : ''}
                                                    onClick={() => this.setState({ invalid: false })}
                                                >
                                                    <Select
                                                        isMulti={true}
                                                        styles={selectStyle}
                                                        onChange={this.handleChangeSubject}
                                                        options={this.state.subjectOptions}
                                                        value={this.state.subjectSelectedOption}
                                                        placeholder="Môn (*)"
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
        addSubjectGroup: subjectGroup => dispatch(subjectGroupAction.addSubjectGroupApi(subjectGroup)),
        updateSubjectGroup: subjectGroup => dispatch(subjectGroupAction.updateSubjectGroupApi(subjectGroup)),
        changeLoading: loading => dispatch(changeLoading(loading))
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSubjectGroup);