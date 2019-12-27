import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { toastrOption } from './../../custom/Custom';
import { changeLoading } from './../../actions/DifActions';
import MediaApi from '../../api/MediaApi';

class EditMedia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: undefined,
            isProcess: false
        }
        toastr.options = toastrOption;
    }

    async componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
    }

    handleChangeInput = e => {
        this.setState({ file: e.target.files[0] });
    }

    handleSave = e => {
        let { file } = this.state;
        if (!file) {
            toastr.error('Không có file nào được chọn!');
        } else {
            this.setState({ isProcess: true });
            MediaApi.upload(file).then(res => {
                if (res.body.code === 200) {
                    toastr.success('Added!');
                } else {
                    toastr.error('Error! ' + code);
                }
                this.setState({ isProcess: false });
            }).catch(error => {
                this.setState({ isProcess: false });
            });
        }
    }

    render() {
        let { myNew } = this.state;
        return (
            <Fragment>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Trang Quản Lý Media
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="#"><i className="fa fa-dashboard" /> New</a></li>
                        <li className="active">add</li>
                    </ol>
                </section>
                {/* Main content */}
                <section className="content container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header">
                                    <h3 className="box-title">Thêm media</h3>
                                </div>
                                {/* <!-- /.box-header --> */}
                                <div className="box-body">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <input type="file" name="file" onChange={this.handleChangeInput} />
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

const mapStateToProps = (state) => {
    return {
        session: state.LoginReducer.session
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loading: loading => dispatch(changeLoading(loading))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMedia);