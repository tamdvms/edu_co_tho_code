import React, { Component, Fragment } from 'react';
import SectorApi from './../../api/SectorApi';
import { connect } from 'react-redux';
import * as sectorAction from './../../actions/SectorActions';
import toastr from 'toastr';
import Select from 'react-select';
import StatusApi from '../../api/StatusApi';
import { selectStyle, toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';

class EditSector extends Component {

    constructor(props) {
        super(props);

        this.init = {
            sector: {
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
            SectorApi.getOne({
                id: props.match.params.id,
                session: this.props.session
            }).then(res => {
                let sector = res.body.data;
                if (sector) {
                    // khởi tạo dữ liệu selected ban đầu
                    this.setState({
                        statusSelectedOption: this.state.statusOptions.filter(el => el.value === sector.status),
                        sector
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
            sector: {
                ...preState.sector,
                status: statusOptions.length > 0 ? statusOptions[0].value : undefined
            },
            statusSelectedOption: statusOptions.length > 0 ? statusOptions[0] : undefined
        }));
    }

    // sự kiện nhập input
    handleChangeInput = (e) => {
        let { name, value } = e.target;
        this.setState(preState => ({
            ...preState,
            sector: {
                ...preState.sector,
                [name]: value
            }
        }));
    }

    handleSave = (e) => {
        e.preventDefault();
        this.setState({
            isProcess: true
        });
        // true tức không hợp lệ
        let invalid = this.checkInput();
        if (invalid) {
            this.setState({ invalid, isProcess: false });
            return;
        }
        let { sector } = this.state;
        if (sector.id) {
            this.props.updateSector(sector).then(code => {
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
            this.props.addSector(sector).then(code => {
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
        let { sector } = this.state;
        sector.status = statusSelectedOption.value
        this.setState({
            sector
        });
    }

    checkInput = () => {
        let { sector } = this.state;
        return sector.name === '';
    }

    render() {
        let { sector } = this.state;
        return (
            <Fragment>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý
                        <small>Khu Vực</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> Sector</a></li>
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
                                                <label htmlFor="name">Tên khu vực (*)</label>
                                                <input
                                                    value={sector.name}
                                                    autoComplete="off"
                                                    type="text"
                                                    className={'form-control' + (this.state.invalid && this.state.sector.name === '' ? ' cus-error' : '')}
                                                    id="name"
                                                    name="name"
                                                    placeholder="Tên khu vực (*)"
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                    onClick={() => this.setState({ invalid: false })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12 col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description">Mô tả khu vực</label>
                                                <input
                                                    autoComplete="off"
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Mô tả khu vực"
                                                    value={sector.description}
                                                    onChange={(e) => this.handleChangeInput(e)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <div className="form-group">
                                                <label htmlFor="status">Trạng thái (*)</label>
                                                <Select
                                                    id="status"
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
        addSector: sector => dispatch(sectorAction.addSectorApi(sector)),
        updateSector: sector => dispatch(sectorAction.updateSectorApi(sector)),
        changeLoading: loading => dispatch(changeLoading(loading))
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSector);