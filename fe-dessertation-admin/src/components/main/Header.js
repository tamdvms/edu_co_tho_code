import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './../../actions/UserActions';

class Header extends Component {

    logout = (e) => {
        e.preventDefault();
        this.props.logout(this.props.session);
    }

    render() {

        let { user } = this.props;
        return (
            <header className="main-header">
                {/* Logo */}
                <a href="index2.html" className="logo">
                    {/* mini logo for sidebar mini 50x50 pixels */}
                    <span className="logo-mini"><b>A</b>LT</span>
                    {/* logo for regular state and mobile devices */}
                    <span className="logo-lg"><b>Admin</b></span>
                </a>
                {/* Header Navbar */}
                <nav className="navbar navbar-static-top" role="navigation">
                    {/* Sidebar toggle button*/}
                    <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                    </a>
                    {/* Navbar Right Menu */}
                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            {/* Messages: style can be found in dropdown.less*/}
                            {/* User Account Menu */}
                            <li className="dropdown user user-menu">
                                {/* Menu Toggle Button */}
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    {/* The user image in the navbar*/}
                                    {/* <img src="/static/images/admin.png" /> */}
                                    {/* hidden-xs hides the username on small devices so only the image appears. */}
                                    <span className="hidden-xs">{user.fullName}</span>
                                </a>
                                <ul className="dropdown-menu">
                                    {/* The user image in the menu */}
                                    <li className="user-header">
                                        <img src="/static/images/admin.png" className="img-circle" alt="User Image" />
                                        <p>
                                            {user.fullName} - FullStack Developer
                                            <small>Member since Nov. 2018</small>
                                        </p>
                                    </li>
                                    {/* Menu Body */}
                                    {/* Menu Footer*/}
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            {/* <a href="#" className="btn btn-default btn-flat">Profile</a> */}
                                        </div>
                                        <div className="pull-right">
                                            <a href="#" className="btn btn-default btn-flat" onClick={(e) => this.logout(e)}>Sign out</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            {/* Control Sidebar Toggle Button */}
                            <li>
                                {/* <a href="#" data-toggle="control-sidebar"><i className="fa fa-gears" /></a> */}
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        logout: (session) => dispatch(actions.logoutApi(session))
    }
}

const mapStateToProps = state => {
    return {
        session: state.LoginReducer.session
    }
}

export default connect(null, mapDispatchToProps)(Header);