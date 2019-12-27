import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/UserActions';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import Nav from './../common/Nav';
import { init_all } from '../../assets/js/all';
import Footer from '../common/Footer';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

class Login extends Component {

    componentDidMount() {
        init_all();
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            mes: '',
            processing: false
        }
    }

    login = e => {
        this.setState({ processing: true });
        e.preventDefault();
        let { email, password } = this.state;
        let mes = '';
        this.props.login(email, password).then(res => {
            if (res.body.code === 200) {
                return;
            }
            if (res.body.code === 803) {
                mes = 'Sai tài khoản hoặc mật khẩu!'
            } else {
                mes = 'Có lỗi xảy ra vui lòng thử lại sau!';
            }
            this.setState({ mes, processing: false });
        }).catch(error => {
            this.setState({ mes: 'Error!', processing: false });
        });
    }

    clearMes = () => {
        this.setState({ mes: '' });
    }

    handleChangeInput = (e) => {
        let { value, name } = e.target;
        this.setState({
            [name]: value
        });
    }

    enter = e => {
        if (e.keyCode === 13) {
            this.login(e);
        }
    }

    responseFacebook = res => {
        let { accessToken } = res;
        this.props.loginFacebook(accessToken);
    }

    componentClicked = () => {
        console.log('click');
    }

    render() {

        console.log(this.props);

        if (this.props.user) {
            let path = (this.props.location.state && this.props.location.state.path) || '/';
            return <Redirect to={path} />;
        }

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
                                        <h1 className="cus-h1 mb-0">Đăng nhập</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="container">
                    <div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                                <form className="form">
                                    <div className="row">
                                        <div className="col-xs-12 mb-20 text-center" style={{ color: 'red' }}>
                                            {this.state.mes}
                                        </div>
                                        <div className="col-xs-12 mb-20">
                                            <input
                                                type="email"
                                                className="form-control input-lg"
                                                placeholder="Email"
                                                onChange={this.handleChangeInput}
                                                value={this.props.email}
                                                name="email"
                                                onClick={this.clearMes}
                                                disabled={this.state.processing}
                                            />
                                        </div>
                                        <div className="col-xs-12 mb-20">
                                            <input
                                                type="password"
                                                className="form-control input-lg"
                                                placeholder="Mật khẩu"
                                                onChange={this.handleChangeInput}
                                                value={this.props.password}
                                                name="password"
                                                onClick={this.clearMes}
                                                disabled={this.state.processing}
                                                onKeyDown={this.enter}
                                            />
                                        </div>
                                        <div className="col-xs-12 mb-20 text-center">

                                            <FacebookLogin
                                                appId="284637609076699"
                                                fields="name,email"
                                                onClick={this.componentClicked}
                                                callback={this.responseFacebook}
                                                render={renderProps => (
                                                    <a
                                                        className="btn-fb"
                                                        onClick={renderProps.onClick}
                                                    >Đăng nhập bằng facebook</a>
                                                )}
                                            />
                                        </div>
                                        <div className="col-xs-12 mb-20 text-center">
                                            <Link to="/forgotPassword">Quên mật khẩu?</Link>
                                        </div>
                                        <div className="col-xs-12 mb-20 text-center">
                                            <a
                                                href="#"
                                                className="btn btn-mod btn-border btn-large btn-round"
                                                onClick={this.login}
                                                disabled={this.state.processing}
                                            >Đăng nhập {this.state.processing && (<i className="fa fa-spinner fa-spin"></i>)}</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </Fragment>
        );
    }
}

Login.propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    loginFacebook: PropTypes.func
}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        login: (email, password) => dispatch(actions.loginApi(email, password)),
        loginFacebook: accessToken => dispatch(actions.loginFacebook(accessToken)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);