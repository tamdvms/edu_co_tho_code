import React, { Component, Fragment } from 'react';
import SchoolApi from '../../api/SchoolApi';
import { connect } from 'react-redux';
import * as schoolAction from '../../actions/SchoolActions';
import toastr from 'toastr';
import Select from 'react-select';
import ProvinceApi from '../../api/ProvinceApi';
import StatusApi from '../../api/StatusApi';
import { selectStyle, toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';

class EditSchool extends Component {

    constructor(props) {
        super(props);

        this.init = {
            school: {
                name: '',
                code: '',
                description: '',
                province: '',
                image: '',
                id: undefined,
                status: 1
            },
            provinceSelectedOption: null,
            statusSelectedOption: null,
            isProcess: false,
        }

        this.state = {
            isUpdate: false,
            statusOptions: [],
            ...this.init,
            province: [],
            pageProvince: 1,
            nextProvince: false,

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
            SchoolApi.getOne({
                id: props.match.params.id,
                session: this.props.session
            }).then(res => {
                let school = res.body.data;
                let pro = school.province;
                school.province = school.province.id;
                if (school) {
                    this.setState({
                        provinceSelectedOption: { label: pro.name },
                        statusSelectedOption: this.state.statusOptions.filter(el => el.value === school.status),
                        school
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
            school: {
                ...preState.school,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            school: {
                ...preState.school,
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
        let { school } = this.state;
        if (school.id) {
            this.props.updateSchool(school).then(code => {
                if (code === 200) {
                    toastr.success('Updated!');
                } else {
                    toastr.error('Error!  + code');
                }
                this.setState({
                    isProcess: false
                });
            });
        } else {
            this.props.addSchool(school).then(code => {
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

    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption });
        let { school } = this.state;
        school.status = statusSelectedOption.value
        this.setState({
            school
        });
    }

    loadProvinces = async page => {
        let rs = await ProvinceApi.getAll({
            page,
            session: this.props.session
        });

        this.setState({
            province: rs.body.data.list,
            nextProvince: rs.body.data.next,
            pageProvince: page
        });
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

    genListProvince = () => {
        let { province } = this.state;
        let rs = null;
        rs = province.map((p, i) => (
            <a
                key={i}
                className={"list-group-item h-hand " + (p.id === this.state.school.province ? 'active' : '')}
                onClick={() => this.handleChangeProvince(p)}
            >{p.name}</a>
        ));
        return rs;
    }

    handleChangeProvince = (s) => {
        $('#modal-province').modal('hide');
        let { school } = this.state;
        school.province = s.id;
        this.setState({
            school,
            provinceSelectedOption: {
                label: s.name
            }
        });
    }

    toggleProvince = () => {
        if (this.state.province.length === 0) {
            this.loadProvinces(this.state.pageProvince);
        }
        $('#modal-province').modal('toggle');
    }

    // trả về true nếu k hợp lệ
    checkInput = () => {
        let { school } = this.state;
        return school.name === '' || school.code === '' || school.status === '';
    }

    render() {
        let { school } = this.state;
        return (
            <Fragment>
                {/* modal */}
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
                        Trang Quản Lý
                        <small>Trường</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> School</a></li>
                        <li className="active">{this.state.isUpdate ? 'update' : 'add'}</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">{(this.state.isUpdate ? 'Cập nhật' : 'Thêm') + ' trường'}</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                            {this.state.invalid && <p>Vui lòng không bỏ trống các trường có dấu (*)</p>}
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="name">Tên trường (*)</label>
                                                <input
                                                    value={school.name}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.school.name === '' ? ' cus-error' : '')}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Tên trường (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="code">Mã trường (*)</label>
                                                <input
                                                    value={school.code}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.school.code === '' ? ' cus-error' : '')}
                                                    id="code"
                                                    name="code"
                                                    placeholder="Mã trường (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description">Mô tả trường</label>
                                                <input
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Mô tả trường"
                                                    value={school.description}
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="image">Hình Ảnh</label>
                                                <input
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="image"
                                                    name="image"
                                                    placeholder="Link Hình Ảnh"
                                                    value={school.image}
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="province">Tỉnh Thành</label>
                                                <div
                                                    className="h-hand"
                                                    onClick={this.toggleProvince}
                                                >
                                                    <Select
                                                        isSearchable={false}
                                                        styles={{ ...selectStyle, menu: () => ({ display: 'none' }) }}
                                                        value={this.state.provinceSelectedOption}
                                                        placeholder="Tỉnh thành"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="status">Trạng Thái (*)</label>
                                                <Select
                                                    styles={selectStyle}
                                                    onChange={this.handleChangeStatus}
                                                    options={this.state.statusOptions}
                                                    value={this.state.statusSelectedOption}
                                                    placeholder="Trạng Thái (*)"
                                                    id="status"
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
        addSchool: school => dispatch(schoolAction.addSchoolApi(school)),
        updateSchool: school => dispatch(schoolAction.updateSchoolApi(school)),
        changeLoading: loading => dispatch(changeLoading(loading))
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSchool);