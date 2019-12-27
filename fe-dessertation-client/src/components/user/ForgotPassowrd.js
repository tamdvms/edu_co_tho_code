import React, { Component, Fragment } from 'react';
import Nav from './../common/Nav';
import { init_all } from '../../assets/js/all';
import Footer from '../common/Footer';
import UserApi from '../../api/UserApi';
import toastr from 'toastr';
import { toastrOption } from '../../contants/options';

class ForgotPassword extends Component {

    componentDidMount() {
        init_all();
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            mesEmail: '',
            processing: false,

            time: 0
        }

        toastr.options = toastrOption;
    }

    handleChangeInput = e => {
        let { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    forgotPassword = e => {
        e.preventDefault();
        this.setState({ processing: true });
        let { email } = this.state;
        let check = this.checkEmail(email);
        if (!check) {
            this.setState({ processing: false });
            return;
        }
        UserApi.forgotPassword({ email }).then(res => {
            // if (res.body.code === 200) {
            //     // send mail success, redirect to changePassword
            // } else {
            //     toastr.error('Có lỗi xảy ra: ' + res.body.code);
            // }
            toastr.success('Vui lòng kiểm tra email để lấy mã xác thực', 'Gửi mail thành công!');
            this.props.history.push("/resetPassword");
            this.setState({ processing: false });
        }).catch(error => {
            // wrong
            console.log(error);
            this.setState({ processing: false });
        });
    }

    // validate input

    checkEmail = email => {
        let mesEmail = '', check = false;
        if (email === '') {
            mesEmail = 'Email không được bỏ trống!';
        } else {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            check = re.test(String(email).toLowerCase());
            if (!check) {
                mesEmail = 'Email không hợp lệ!';
            }
        }
        this.setState({ mesEmail });
        return check;
    }

    countDown = time => {
        if (time === 0) {
            this.props.history.push("/resetPassword");
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
                                                Vui lòng sử dụng email của bạn để nhận mã đặt lại mật khẩu.
                                            </h5>
                                        </div>
                                        <div className="col-xs-12 mb-20">
                                            <div className="cus-mes">
                                                {this.state.mesEmail}
                                            </div>
                                            <input
                                                type="email" name="email"
                                                className={'form-control input-lg' + (this.state.mesEmail !== '' ? ' cus-error-field' : '')}
                                                placeholder="Email (*)"
                                                onChange={this.handleChangeInput}
                                                onClick={() => this.setState({ mesEmail: '' })}
                                            />
                                        </div>
                                        <div className="col-xs-12 text-center">
                                            <button
                                                className="btn btn-mod btn-border btn-large btn-round pr-70 pl-70"
                                                onClick={this.forgotPassword}
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

export default ForgotPassword;