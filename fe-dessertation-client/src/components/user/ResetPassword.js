import React, { Component, Fragment } from 'react';
import Nav from './../common/Nav';
import { init_all } from '../../assets/js/all';
import Footer from '../common/Footer';
import UserApi from '../../api/UserApi';
import toastr from 'toastr';
import { toastrOption } from '../../contants/options';

class Register extends Component {

    componentDidMount() {
        init_all();
    }

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            password: '',
            passwordCfm: '',

            mesCode: '',
            mesPassword: '',
            mesPasswordCfm: '',

            processing: false,

            time: 0
        }
        this.MES_EMPTY = 'Trường này không được để trống!';
        toastr.options = toastrOption;
    }

    handleChangeInput = e => {
        let { name, value } = e.target;

        // validate code length
        if (name === 'code' && value.length > 6) {
            return;
        }
        this.setState({
            [name]: value
        });
    }

    changePassword = e => {
        e.preventDefault();
        this.setState({ processing: true });
        let { code, password, passwordCfm } = this.state;
        let check = this.checkCode(code) && this.checkPassword(password) && this.checkPasswordCfm(password, passwordCfm);
        if (!check) {
            this.setState({ processing: false });
            return;
        }
        UserApi.changePassword({ token: code, password }).then(res => {
            // if (res.body.code === 200) {
            //     // success
            //     this.countDown(3000);
            // } else {
            //     toastr.error('Có lỗi xảy ra: ' + res.body.code);
            // }
            toastr.success('Hãy thử sử dụng mật khẩu mới để đăng nhập', 'Đặt lại mật khẩu thành công!');
            this.props.history.push("/login");
            this.setState({ processing: false });
        }).catch(error => {
            // wrong
            this.setState({ processing: false });
            throw (error);
        });
    }

    // validate input 

    checkCode = code => {
        let mesCode = '', check = false;
        if (code === '') {
            mesCode = this.MES_EMPTY;
        } else if (code.length !== 6) {
            mesCode = 'Mã xác thực phải là 6 chữ số';
        } else {
            check = true;
        }
        this.setState({ mesCode });
        return check;
    }

    checkPassword = password => {
        let mesPassword = '', check = false;
        if (password === '') {
            mesPassword = this.MES_EMPTY;
        } else if (password.length < 6) {
            mesPassword = 'Mật khẩu phải có độ dài từ 6 kí tự!';
        } else {
            check = true;
        }
        this.setState({ mesPassword });
        return check;
    }

    checkPasswordCfm = (password, passwordcfm) => {
        let mesPasswordCfm = '', check = false;
        if (password !== passwordcfm) {
            mesPasswordCfm = 'Mật khẩu và xác nhận mật khẩu không khớp!';
        } else if (passwordcfm === '') {
            mesPasswordCfm = this.MES_EMPTY;
        } else {
            check = true;
        }
        this.setState({ mesPasswordCfm });
        return check;
    }

    countDown = time => {
        if (time === 0) {
            this.props.history.push("/login");
        } else {
            this.setState({ time }, () => {
                setTimeout(() => {
                    this.countDown(time - 1000);
                }, 1000);
            });
        }
    }

    render() {

        return (
            <Fragment>
                <header style={{ backgroundImage: 'linear-gradient(to bottom right, #00a6c1, #a9c3ea)' }}>
                    <div className="cover" />
                    {/* Navigation panel */}

                    <Nav />

                    {/* End Navigation panel */}
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-lg-8 col-lg-offset-2">
                                <div className="row mb-20">
                                    <div className="col-xs-12 text-center">
                                        <h1 className="cus-h1 mb-0">Đặt lại mật khẩu</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="container">
                    <div style={{ paddingTop: 70, paddingBottom: 70 }}>
                        <div className="row">
                            <div className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                                <form className="form">
                                    <div className="row">
                                        <div className="col-xs-12 mb-20 text-center">
                                            <h5>
                                                Vui lòng kiểm tra email của bạn để lấy mã xác thực, nếu không nhận được email vui lòng chắc rằng bạn đã nhập đúng email của mình.
                                            </h5>
                                        </div>
                                        <div className="col-xs-12 mb-30">
                                            <div className="cus-mes">
                                                {this.state.mesCode}
                                            </div>
                                            <input
                                                type="text" name="code"
                                                className={'form-control input-lg' + (this.state.mesCode !== '' ? ' cus-error-field' : '')}
                                                placeholder="Mã xác thực (*)"
                                                onChange={this.handleChangeInput}
                                                onClick={() => this.setState({ mesCode: '' })}
                                                value={this.state.code}
                                            />
                                        </div>
                                        <div className="col-xs-12 mb-30">
                                            <div className="cus-mes">
                                                {this.state.mesPassword}
                                            </div>
                                            <input
                                                type="password" name="password"
                                                className={'form-control input-lg' + (this.state.mesPassword !== '' ? ' cus-error-field' : '')}
                                                placeholder="Mật khẩu mới (*)"
                                                onChange={this.handleChangeInput}
                                                onClick={() => this.setState({ mesPassword: '' })}
                                            />
                                        </div>
                                        <div className="col-xs-12 mb-30">
                                            <div className="cus-mes">
                                                {this.state.mesPasswordCfm}
                                            </div>
                                            <input
                                                type="password" name="passwordCfm"
                                                className={'form-control input-lg' + (this.state.mesPasswordCfm !== '' ? ' cus-error-field' : '')}
                                                placeholder="Xác nhận mật khẩu mới (*)"
                                                onChange={this.handleChangeInput}
                                                onFocus={() => this.setState({ mesPasswordCfm: '' })}
                                            />
                                        </div>
                                        <div className="col-xs-12 text-center">
                                            <button
                                                className="btn btn-mod btn-border btn-large btn-round pr-70 pl-70"
                                                onClick={this.changePassword}
                                                disabled={this.state.processing}
                                            >
                                                Gửi {this.state.processing && (<i className="fa fa-spinner fa-spin"></i>)}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </Fragment >
        );
    }
}

export default Register;

