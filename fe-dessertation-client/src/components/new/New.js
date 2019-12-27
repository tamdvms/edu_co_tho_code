import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import Nav from './../common/Nav';
import { init_all } from '../../assets/js/all';
import Footer from '../common/Footer';
import * as actions from '../../actions/NewActions';
import * as load from '../../actions/LoadingActions';
import NewItem from './NewItem';
import qs from 'query-string';

class New extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
    }

    async componentDidMount() {
        init_all();
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadNews();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadNews();
        }
    }

    initFilter = filter => {
        let { page } = filter;
        page = Number(page) || 1;
        this.setState({ page });
    }

    pushUrl = () => {
        let { page } = this.state;
        let query = '?';
        query += page ? ('page=' + page) : '';
        this.props.history.push(this.props.location.pathname + query);
    }

    loadNews = () => {
        this.props.loading(true);
        let { page } = this.state;
        this.props.loadNews(page).then(res => {
            this.props.loading(false);
        }).catch(error => {
            this.props.loading(false);
        });
    }

    newPage = (e, num) => {
        e.preventDefault();
        let { page } = this.state;
        if ((page === 1 && num < 0) || (this.props.data.next === false && num > 0)) {
            return;
        } else {
            this.setState({ page: page + num }, this.pushUrl);
        }
    }

    getListNew = () => {
        let rs = null;
        let { news } = this.props.data;
        if (news) {
            rs = news.map((el, index) => (
                <NewItem key={index} myNew={el} />
            ));
        }
        return rs;
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
                                        <h1 className="cus-h1 mb-0">Tin Tức</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="container">
                    <div className="mod-content row">
                        <div id="sidebar" className="col-lg-3 col-md-3 hidden-sm hidden-xs">
                            <div className="menu-sidebar">
                                <ul>
                                    <li><a href='#' title='Sự kiện'><span>Sự kiện</span></a></li>
                                    <li><a href='#' title='Blog'><span>Blog</span></a></li>
                                    <li className="active"><Link to='/new' title='Hot News'><span>Hot News</span></Link></li>
                                </ul>
                            </div>
                        </div>
                        <div id="main" className="col-lg-9 col-md-9 col-sm-12 col-xs-12 news-page">
                            <div className="row">
                                {this.getListNew()}
                            </div>
                            <div className="row">
                                <div className="text-right">
                                    <nav className="d-inline-block" aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a
                                                    className={'page-link' + (this.state.page === 1 ? ' cus-disabled' : '')}
                                                    href="#"
                                                    aria-label="Previous"
                                                    onClick={e => this.newPage(e, -1)}
                                                >
                                                    <span aria-hidden="true">«</span>
                                                    <span className="sr-only">Previous</span>
                                                </a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link">{this.state.page}</a>
                                            </li>
                                            <li className="page-item">
                                                <a
                                                    className={'page-link' + (this.props.data.next ? '' : ' cus-disabled')}
                                                    aria-label="Next"
                                                    href="#"
                                                    onClick={e => this.newPage(e, 1)}
                                                >
                                                    <span aria-hidden="true">»</span>
                                                    <span className="sr-only">Next</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
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

New.propTypes = {
    data: PropTypes.object,
    loadNews: PropTypes.func,
    loading: PropTypes.func
}

const mapStateToProps = state => {
    return {
        data: state.NewReducer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadNews: page => dispatch(actions.loadNewApi(page)),
        loading: loading => dispatch(load.loading(loading))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(New);