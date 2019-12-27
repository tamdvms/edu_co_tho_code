import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import App from './App';
import Home from './components/home/Home';
import Search from './components/search/Search';
import Login from './components/page/Login';
import Register from './components/user/Register';
import * as actions from './actions/UserActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ResetPassword from './components/user/ResetPassword';
import ForgotPassword from './components/user/ForgotPassowrd';
import SchoolDetail from './components/school/SchoolDetail';
import Profile from './components/user/Profile';
import Update from './components/user/Update';
import Suggest from './components/suggest/Suggest';
import Suggest2 from './components/suggest/Suggest2';
import New from './components/new/New';
import NewDetail from './components/new/NewDetail';
import Test from './components/page/Test';

class MyRoute extends Component {

    constructor(props) {
        super(props);
        let session = localStorage.getItem('session');
        if (session) {
            this.props.loginSession(session);
        }
    }

    render() {
        let { user } = this.props;
        return (
            <BrowserRouter>
                <Route render={props => (
                    <App {...props}>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/login" component={Login} />
                            <Route path="/search" component={Search} />
                            <Route path="/register" component={Register} />
                            {/* <Route path="/user/update" component={Update} /> */}
                            <Route path="/user/update" render={props => user ? <Update {...props} /> : <Redirect to={{ pathname: '/login', state: { path: '/user/update' } }} />} />
                            <Route path="/resetPassword" component={ResetPassword} />
                            <Route path="/forgotPassword" component={ForgotPassword} />
                            <Route path="/school/detail/" component={SchoolDetail} />
                            {/* <Route path="/user/profile/" component={Profile} /> */}
                            <Route path="/user/profile/" render={props => user ? <Profile {...props} /> : <Redirect to={{ pathname: '/login', state: { path: '/user/profile' } }} />} />
                            {/* <Route path="/suggest" component={Suggest} /> */}
                            <Route path="/suggest" render={props => user ? <Suggest {...props} /> : <Redirect to={{ pathname: '/login', state: { path: '/suggest' } }} />} />
                            <Route exact path="/new" component={New} />
                            <Route path="/new/detail/" component={NewDetail} />
                            <Route path="/suggest2/" component={Suggest2} />
                            <Route path="/test/" component={Test} />
                        </Switch>
                    </App>
                )} />
            </BrowserRouter>
        );
    }
}

MyRoute.propTypes = {
    logout: PropTypes.func,
    loginSession: PropTypes.func,
    user: PropTypes.object
}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        logout: () => dispatch(actions.logoutApi()),
        loginSession: session => dispatch(actions.loginSession(session))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRoute);
