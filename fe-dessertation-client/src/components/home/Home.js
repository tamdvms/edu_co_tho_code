import React, { Component, Fragment } from 'react';
import { Link, NavLink, Route, BrowserRouter } from 'react-router-dom';
import Nav from '../common/Nav';
import { init_all } from '../../assets/js/all';

class Home extends Component {

    componentDidMount() {
        init_all();
    }

    render() {
        return (
            <Fragment>
                <Nav />

                <section className="bg-dark-alfa-30 parallax-2" id="home" style={{ backgroundImage: 'linear-gradient(to bottom right, #00a6c1, #a9c3ea)' }}>
                    <div className="js-height-full container" style={{ height: 626 }}>
                        {/* Hero Content */}
                        <div className="home-content">
                            <div className="home-text">
                                <h1 className="hs-line-8 no-transp mb-50 mb-xs-30">
                                    ĐIỂM CHUẨN ĐẠI HỌC / TƯ VẤN TUYỂN SINH
                                </h1>
                                <h2 className="hs-line-14 mb-50 mb-xs-30">
                                    Tuyển sinh
                                </h2>
                                <div className="local-scroll">
                                    <Link to='/search' className="btn btn-mod btn-border-w btn-circle btn-large mb-10">
                                        Tra cứu điểm chuẩn
                                    </Link>
                                    <span className="hidden-xs">&nbsp;</span>
                                    <Link to='/suggest' className="btn btn-mod btn-border-w btn-circle btn-large mb-10">
                                        Tư vấn chọn trường
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* End Hero Content */}
                    </div>
                </section>
            </Fragment>
        );
    }
}

export default Home;