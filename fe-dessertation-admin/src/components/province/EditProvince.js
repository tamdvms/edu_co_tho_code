import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import toastr from 'toastr';
import * as provinceAction from '../../actions/ProvinceActions';
import ProvinceApi from '../../api/ProvinceApi';
import SectorApi from '../../api/SectorApi';
import StatusApi from '../../api/StatusApi';
import { selectStyle, toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';

class EditProvince extends Component {

    constructor(props) {
        super(props);

        this.init = {
            province: {
                name: '',
                description: '',
                sector: '',
                id: undefined,
                status: ''
            },
            isProcess: false,
            sectorSelectedOption: null
        }

        this.state = {
            isUpdate: false,
            sectorOptions: [],
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

    loadSectorOption = async () => {
        // get all sector in database
        let next = true, rs = [], tmp, page = 1;
        while (next) {
            tmp = await SectorApi.getAll({
                page: page++,
                session: this.props.session
            });
            rs = rs.concat(tmp.body.data.list);
            next = tmp.body.data.next;
        }
        this.setState({
            sectorOptions: rs.map(el => ({ value: el.id, label: el.name }))
        });
    }

    updateAction = async (props) => {
        let isUpdate = props.do === 'update' ? true : false
        this.setState({ isUpdate });
        await this.loadSectorOption();
        await this.loadStatusOption();
        // lấy dữ liệu lên nếu là update
        if (isUpdate) {
            ProvinceApi.getOne({
                id: props.match.params.id,
                session: this.props.session
            }).then(res => {
                let province = res.body.data;
                if (province) {
                    this.setState({
                        sectorSelectedOption: this.state.sectorOptions.filter(el => el.value === province.sector),
                        statusSelectedOption: this.state.statusOptions.filter(el => el.value === province.status),
                        province
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
            province: {
                ...preState.province,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            province: {
                ...preState.province,
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
        let { province } = this.state;
        if (province.id) {
            this.props.updateProvince(province).then(code => {
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
            this.props.addProvince(province).then(code => {
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

    handleChangeSector = (sectorSelectedOption) => {
        this.setState({ sectorSelectedOption });
        let { province } = this.state;
        province.sector = sectorSelectedOption.value
        this.setState({
            province
        });
    }

    // sự kiện select status
    handleChangeStatus = (statusSelectedOption) => {
        this.setState({ statusSelectedOption });
        let { province } = this.state;
        province.status = statusSelectedOption.value
        this.setState({
            province
        });
    }

    // trả về true nếu k hợp lệ, ngược lại trả về false
    checkInput = () => {
        let { province } = this.state;
        return province.id === '' || province.status === '' || province.sector === '';
    }

    render() {
        let { province } = this.state;
        return (
            <Fragment>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý
                        <small>Tỉnh Thành</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Province</a></li>
                        <li className="active">{this.state.isUpdate ? 'update' : 'add'}</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">{(this.state.isUpdate ? 'Cập nhật' : 'Thêm') + ' tỉnh thành'}</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                            {this.state.invalid && <p>Vui lòng không bỏ trống các trường có dấu (*)</p>}
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="name">Tên tỉnh thành (*)</label>
                                                <input
                                                    value={province.name}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.province.name === '' ? ' cus-error' : '')}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Tên tỉnh thành (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description">Mô tả tỉnh thành</label>
                                                <input
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Mô tả tỉnh thành"
                                                    value={province.description}
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="sector">Khu vực (*)</label>
                                                <div
                                                    className={this.state.invalid && this.state.province.sector === '' ? 'cus-error' : ''}
                                                    onClick={() => this.setState({ invalid: false })}
                                                >
                                                    <Select
                                                        styles={selectStyle}
                                                        onChange={this.handleChangeSector}
                                                        options={this.state.sectorOptions}
                                                        value={this.state.sectorSelectedOption}
                                                        placeholder="Khu Vực (*)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="status">Trạng thái (*)</label>
                                                <div className={this.state.invalid && this.state.province.status === '' ? 'cus-error' : ''}>
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
        addProvince: province => dispatch(provinceAction.addProvinceApi(province)),
        updateProvince: province => dispatch(provinceAction.updateProvinceApi(province)),
        changeLoading: loading => dispatch(changeLoading(loading))
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditProvince);