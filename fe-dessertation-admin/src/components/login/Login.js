import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import UserApi from './../../api/UserApi';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            mes: ''
        }
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    login = (e) => {
        e.preventDefault();
        let { username, password } = this.state;
        UserApi.login({ username, password }).then(res => {
            let { code } = res.body;
            if (code === 200) {
                let { data } = res.body;
                console.log(data);
                data.user.role = JSON.parse(data.user.role.roles);
                localStorage.setItem('data', JSON.stringify(data));
                window.location.reload();
            } else {
                let mes = '';
                if (code === 804) {
                    mes = 'Tài khoản chưa kích hoạt!';
                } else if (code === 803) {
                    mes = 'Tài khoản hoặc mật khẩu không hợp lệ!';
                } else {
                    mes = 'Có lỗi xảy ra vui lòng thử lại sau!';
                }
                this.setState({ mes });
            }
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row" style={{ marginTop: '20vh' }}>
                    <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                        <div className="box box-info">
                            <div className="box-header with-border text-center">
                                <h3 className="box-title">Đăng nhập</h3>
                            </div>
                            <form className="form-horizontal">
                                <div className="box-body">
                                    <div className="col-xs-12">
                                        <div className="form-group">
                                            <label htmlFor="username">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="username"
                                                name="username"
                                                placeholder="Tên đăng nhập"
                                                value={this.state.username}
                                                onChange={(e) => this.onChange(e)}
                                                onClick={() => this.setState({mes: ''})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Mật khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                placeholder="Mật khẩu"
                                                value={this.state.password}
                                                onChange={(e) => this.onChange(e)}
                                                onClick={() => this.setState({mes: ''})}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 text-center" style={{ color: 'red' }}>
                                        <h5>{this.state.mes}</h5>
                                    </div>
                                </div>
                                {/* /.box-body */}
                                <div className="box-footer">
                                    <button
                                        type="submit"
                                        className="btn btn-primary pull-right"
                                        onClick={(e) => this.login(e)}
                                    >Đăng nhập</button>
                                </div>
                                {/* /.box-footer */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;