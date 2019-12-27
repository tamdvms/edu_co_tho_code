import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import Select from 'react-select';
import * as majorAction from '../../actions/MajorActions';
import MajorApi from '../../api/MajorApi';
import SchoolApi from '../../api/SchoolApi';
import StatusApi from '../../api/StatusApi';
import { selectStyle, toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';

class EditMajor extends Component {

    constructor(props) {
        super(props);

        this.init = {
            major: {
                id: undefined,
                name: '',
                code: '',
                school: '',
                status: ''
            },
            isProcess: false,
            statusSelectedOption: null,
            schoolSelectedOption: null
        }

        this.state = {
            isUpdate: false,
            statusOptions: [],
            ...this.init,

            school: [],
            pageSchool: 1,
            nextSchool: false,

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
        if (isUpdate) {
            MajorApi.getOne({
                id: props.match.params.id,
                session: this.props.session
            }).then(res => {
                let major = res.body.data;
                if (major) {
                    let s = major.school;
                    major.school = s.id;
                    this.setState({
                        schoolSelectedOption: { label: s.name },
                        statusSelectedOption: this.state.statusOptions.filter(el => el.value === major.status),
                        major
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
            major: {
                ...preState.major,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            major: {
                ...preState.major,
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
        let { major } = this.state;
        if (major.id) {
            this.props.updateMajor(major).then(code => {
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
            this.props.addMajor(major).then(code => {
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

    handleChangeSchool = (schoolSelectedOption) => {
        this.setState({ schoolSelectedOption });
        let { major } = this.state;
        major.school = schoolSelectedOption.value
        this.setState({
            major
        });
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption });
        let { major } = this.state;
        major.status = statusSelectedOption.value
        this.setState({
            major
        });
    }

    toggleSchool = () => {
        if (this.state.school.length === 0) {
            this.loadSchools(this.state.pageSchool);
        }
        $('#modal-school').modal('toggle');
    }

    handleChangeSchool = (s) => {
        $('#modal-school').modal('hide');
        let { major } = this.state;
        major.school = s.id;
        this.setState({ major, schoolSelectedOption: { label: s.name } });
    }

    genListSchool = () => {
        let { school } = this.state;
        let rs = null;
        rs = school.map((s, i) => (
            <a
                key={i}
                className={"list-group-item h-hand " + (s.id === this.state.major.school ? 'active' : '')}
                onClick={() => this.handleChangeSchool(s)}
            >{s.name}</a>
        ));
        return rs;
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

    loadSchools = async page => {
        let rs = await SchoolApi.getAll({
            page,
            session: this.props.session
        });

        this.setState({
            school: rs.body.data.list,
            nextSchool: rs.body.data.next,
            pageSchool: page
        });
    }

    checkInput = () => {
        let { major } = this.state;
        return major.name === '' || major.school === '' || major.status === '' || major.code === '';
    }

    render() {
        let { major } = this.state;
        return (
            <Fragment>
                {/* modal school */}
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
                        Trang Quản Lý
                        <small>Khu Vực</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Major</a></li>
                        <li className="active">{this.state.isUpdate ? 'update' : 'add'}</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">{(this.state.isUpdate ? 'Cập nhật' : 'Thêm') + ' khu vực'}</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                            {this.state.invalid && <p>Vui lòng không bỏ trống các trường có dấu (*)</p>}
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="name">Tên Ngành (*)</label>
                                                <input
                                                    value={major.name}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.major.name === '' ? ' cus-error' : '')}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Tên Ngành (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="code">Mã Ngành (*)</label>
                                                <input
                                                    value={major.code}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.major.code === '' ? ' cus-error' : '')}
                                                    id="code"
                                                    name="code"
                                                    placeholder="Mã Ngành (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="school">Trường (*)</label>
                                                <div className="form-group">
                                                    <div
                                                        className={'h-hand' + (this.state.invalid && this.state.major.school === '' ? ' cus-error' : '')}
                                                        onClick={() => { this.toggleSchool(); this.setState({ invalid: false }); }}
                                                    >
                                                        <Select
                                                            isSearchable={false}
                                                            styles={{ ...selectStyle, menu: () => ({ display: 'none' }) }}
                                                            value={this.state.schoolSelectedOption}
                                                            placeholder="Trường (*)"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="status">Trạng thái (*)</label>
                                                <div className="form-group">
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
        addMajor: major => dispatch(majorAction.addMajorApi(major)),
        updateMajor: major => dispatch(majorAction.updateMajorApi(major)),
        changeLoading: loading => dispatch(changeLoading(loading))
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMajor);