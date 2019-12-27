import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import Nav from '../common/Nav';
import { init_all } from '../../assets/js/all';
import Footer from '../common/Footer';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        init_all();
    }

    convertDate = date => {
        date = new Date(date);
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    }

    render() {

        let { user } = this.props;

        // if (!user) {
        //     this.props.location.state = { path: '/profile' };
        //     return <Redirect to={{
        //         pathname: '/login',
        //         state: {
        //             path: '/user/profile'
        //         }
        //     }} />
        // }

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
                                        <h1 className="cus-h1 mb-0">Thông tin tài khoản</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="container">
                    <div style={{ paddingTop: 70, paddingBottom: 70 }}>
                        <div className="row">
                            <div className="col-xs-12 col-lg-10 col-lg-offset-1">
                                <div className="row text-center" style={{ color: '#4d4d4d' }}>
                                    <div className="col-xs-12 mb-30 cus-over-x-auto">
                                        <i className="fas fa-6x fa-user"></i>
                                        <h1 style={{ textTransform: 'uppercase' }}>
                                            {user.fullName}
                                        </h1>
                                    </div>
                                    <div className="col-xs-6 col-md-4 mb-30 cus-over-x-auto">
                                        <i className="fas fa-3x fa-transgender"></i>
                                        <h4>
                                            {user.sex === 'male' ? 'Nam' : user.sex === 'female' ? 'Nữ' : 'Khác'}
                                        </h4>
                                    </div>
                                    <div className="col-xs-6 col-md-4 mb-30 cus-over-x-auto">
                                        <i className="fas fa-3x fa-birthday-cake"></i>
                                        <h4>
                                            {this.convertDate(user.birthday)}
                                        </h4>
                                    </div>
                                    <div className="col-xs-6 col-md-4 mb-30 cus-over-x-auto">
                                        <i className="fas fa-3x fa-phone"></i>
                                        <h4>
                                            {user.phonenumber}
                                        </h4>
                                    </div>
                                    <div className="col-xs-6 col-md-4 mb-30 cus-over-x-auto">
                                        <i className="fas fa-3x fa-map"></i>
                                        <h4>
                                            {user.province.name}
                                        </h4>
                                    </div>
                                    <div className="col-xs-6 col-md-4 mb-30 cus-over-x-auto">
                                        <i className="fas fa-3x fa-envelope"></i>
                                        <h4>
                                            {user.email}
                                        </h4>
                                    </div>
                                    <div className="col-xs-6 col-md-4 mb-30 cus-over-x-auto">
                                        <i className="fas fa-3x fa-graduation-cap"></i>
                                        <h4>
                                            {user.purpose.code}
                                        </h4>
                                    </div>
                                    <div className="col-xs-12 text-center">
                                        <Link to="/user/update">Cập nhật thông tin</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </Fragment>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.object
}

const mapStateToProps = state => {
    return {
        user: state.UserReducer.user
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);