import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from './../../actions/UserActions';

class Nav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    logout = e => {
        e.preventDefault();
        this.props.logout().then(res => {
            this.setState({
                open: false
            });
        });
    }

    switchNav = () => {
        this.setState({
            open: !this.state.open
        });
    }

    closeMenu = () => {
        this.setState({ open: false });
    }

    render() {

        let { user } = this.props;

        return (
            <nav className="main-nav dark cus-blue transparent stick-fixed">
                <div className="full-wrapper relative clearfix">
                    {/* Logo ( * your text or image into link tag *) */}
                    <div className="nav-logo-wrap local-scroll">
                        <NavLink exact to='/' className="logo"><b>EDUCATION</b></NavLink>
                    </div>
                    <div
                        className="mobile-nav"
                        onClick={this.switchNav}
                    >
                        <i className={"fa " + (this.state.open ? "fa-times" : "fa-bars")} />
                    </div>
                    {/* Main Menu */}
                    <div className="inner-nav desktop-nav">
                        <ul className="clearlist scroll-nav local-scroll">
                            <li>
                                <NavLink onClick={this.closeMenu} exact to='/'>Trang chủ</NavLink>
                            </li>
                            <li>
                                <NavLink onClick={this.closeMenu} to='/search'>Tra cứu</NavLink>
                            </li>
                            <li>
                                <NavLink onClick={this.closeMenu} to='/suggest'>Tư vấn</NavLink>
                            </li>
                            <li>
                                <NavLink onClick={this.closeMenu} to='/new'>Tin tức</NavLink>
                            </li>
                            <li>
                                {user ? (<Fragment>
                                    <a href="#" className="mn-has-sub"><i className="fas fa-user"></i> {user.fullName} <i className="fa fa-angle-down"></i></a>
                                    <ul className="mn-sub to-left">
                                        <li>
                                            <NavLink onClick={this.closeMenu} to='/user/profile'><i className="fas fa-info"></i> Thông tin</NavLink>
                                        </li>
                                        <li>
                                            <a href="#" onClick={e => { this.logout(e); this.closeMenu() }}><i className="fas fa-sign-out-alt"></i> Đăng xuất</a>
                                        </li>
                                    </ul>
                                </Fragment>) : (<Fragment>
                                    <a href="#" className="mn-has-sub">Tài khoản <i className="fa fa-angle-down"></i></a>
                                    <ul className="mn-sub to-left">
                                        <li>
                                            <NavLink onClick={this.closeMenu} to='/login'><i className="fas fa-sign-in-alt"></i> Đăng nhập</NavLink>
                                        </li>
                                        <li>
                                            <NavLink onClick={this.closeMenu} to='/register'><i className="fas fa-user-plus"></i> Đăng ký</NavLink>
                                        </li>
                                    </ul>
                                </Fragment>)}
                            </li>
                            {/* End Item With Sub */}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

Nav.propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func
}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        logout: () => dispatch(actions.logoutApi())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);