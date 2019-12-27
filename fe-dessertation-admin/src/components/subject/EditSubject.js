import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as subjectAction from '../../actions/SubjectActions';
import toastr from 'toastr';
import SubjectApi from '../../api/SubjectApi';
import StatusApi from '../../api/StatusApi';
import Select from 'react-select';
import { selectStyle, toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';

class EditSubject extends Component {

    constructor(props) {
        super(props);

        this.init = {
            subject: {
                name: '',
                description: '',
                id: undefined,
                status: ''
            },
            statusSelectedOption: null,
            isProcess: false
        }

        this.state = {
            isUpdate: false,
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
        // lấy dữ liệu lên nếu là update
        if (isUpdate) {
            SubjectApi.getOne({
                id: props.match.params.id,
                session: this.props.session
            }).then(res => {
                let subject = res.body.data;
                if (subject) {
                    this.setState({
                        statusSelectedOption: this.state.statusOptions.filter(el => el.value === subject.status),
                        subject
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
            subject: {
                ...preState.subject,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            subject: {
                ...preState.subject,
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
        let { subject } = this.state;
        if (subject.id) {
            this.props.updateSubject(subject).then(code => {
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
            this.props.addSubject(subject).then(code => {
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

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption });
        let { subject } = this.state;
        subject.status = statusSelectedOption.value
        this.setState({
            subject
        });
    }

    checkInput = () => {
        let { subject } = this.state;
        return subject.name === '' || subject.status === '';
    }

    render() {
        let { subject } = this.state;
        return (
            <Fragment>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý
                        <small>Môn Thi</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Subject</a></li>
                        <li className="active">{this.state.isUpdate ? 'update' : 'add'}</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">{(this.state.isUpdate ? 'Cập nhật' : 'Thêm') + ' môn thi'}</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                            {this.state.invalid && <p>Vui lòng không bỏ trống các trường có dấu (*)</p>}
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="name">Tên môn (*)</label>
                                                <input
                                                    value={subject.name}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.subject.name === '' ? ' cus-error' : '')}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Tên môn (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description">Mô Tả</label>
                                                <input
                                                    value={subject.description}
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Mô Tả"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <div className="form-group">
                                                <label htmlFor="description">Trạng thái (*)</label>
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
        addSubject: subject => dispatch(subjectAction.addSubjectApi(subject)),
        updateSubject: subject => dispatch(subjectAction.updateSubjectApi(subject)),
        changeLoading: loading => dispatch(changeLoading(loading))
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSubject);