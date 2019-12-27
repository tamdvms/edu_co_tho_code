import React, { Component, Fragment } from 'react';
import qs from 'query-string';
import { connect } from 'react-redux';
import NewApi from '../../api/NewApi';
import Nav from '../common/Nav';
import Footer from '../common/Footer';
import { init_all } from '../../assets/js/all';
import * as load from '../../actions/LoadingActions';
import PropTypes from 'prop-types';
import { convertDate } from '../../custom/index';

class NewDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            myNew: undefined,
            pholder: 'Bình luận ở đây!!!',
            closeBtn: 'Đóng'
        }
    }

    async componentDidMount() {
        init_all();
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadNew();
    }

    initFilter = filter => {
        let { id } = filter;
        this.setState({ id });
    }

    loadNew = () => {
        let { id } = this.state;
        NewApi.getOne({ id }).then(res => {
            this.setState({ myNew: res.body.data });
        });
    }

    toggleComment = e => {
        let { pholder } = this.state;
        pholder = 'Bình luận ở đây!!!' === pholder ? 'Mời nhập thắc mắc hoặc ý kiến của bạn' : 'Mời nhập thắc mắc hoặc ý kiến của bạn';
        this.setState({ pholder }, () => {
            $('.content-info').slideDown(700);
        });
    }

    closeCmt = e => {
        let { closeBtn } = this.state;
        closeBtn = 'Đóng';
        this.setState({ closeBtn }, () => {
            $(".content-info").slideUp(700);
        });
    }

    render() {

        let { myNew } = this.state;
        console.log(myNew);

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
                                        <h1 className="cus-h1 mb-0">Tin tức</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <section className="container">
                    <div className="wrapper">
                        <div className="box_mid">
                            <div className="mid-content">
                                <div className="mod-content row">
                                    <div id="main" className="col-xs-12 col-md-10 col-md-offset-1">
                                        <div className="news-content desc">
                                            <div>
                                                <h1 style={{ color: '#3d3d3d', marginBottom: '10px' }}>
                                                    {myNew && myNew.title}
                                                </h1>
                                            </div>
                                            <div>
                                                {myNew && convertDate(myNew.createdAt)}
                                            </div>
                                            <div align="justify">
                                                {myNew && <div dangerouslySetInnerHTML={{ __html: myNew.content }}></div>}
                                            </div>
                                        </div>
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

NewDetail.propTypes = {
    loading: PropTypes.func
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loading: loading => dispatch(load.loading(loading)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDetail);