import React, { Component, Fragment } from 'react';
import Footer from '../common/Footer';
import { connect } from 'react-redux';
import * as actions from '../../actions/SchoolActions';
import Nav from '../common/Nav';
import { init_all } from '../../assets/js/all';
import qs from 'query-string';
import PropTypes from 'prop-types';
import SuggestItem from './SuggestItem';
import * as load from '../../actions/LoadingActions';

class Suggest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
    }

    async componentDidMount() {
        // phải login trước
        if (!this.props.user) {
            return this.props.history.push('/login');
        }
        init_all();
        await this.initFilter(qs.parse(this.props.location.search));
        this.loadSchools();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadSchools();
        }
    }

    initFilter = filter => {
        let { page } = filter;
        page = Number(page) || 1;
        page = page < 0 ? 1 : page;
        this.setState({ page });
    }

    pushUrl = () => {
        let { page } = this.state;
        let query = '?';
        query += page ? ('page=' + page) : '';
        this.props.history.push(this.props.location.pathname + query);
    }

    loadSchools = () => {
        this.props.loading(true);
        let province, subjectGroup, { page } = this.state;
        province = this.props.user.province.id;
        subjectGroup = this.props.user.purpose.id;
        this.props.loadSchools(page, province, subjectGroup).then(res => {
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

    genListSchool = () => {
        let rs = null;
        let { schools } = this.props.data;
        console.log(schools);
        if (schools) {
            rs = schools.map((el, index) => (
                <SuggestItem key={index} school={el} />
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
                                        <h1 className="cus-h1 mb-0">Trường gợi ý</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section>
                    <div className="container pt-30 pb-70">
                        <div className="row">
                            <div className="col-xs-12">
                                <div style={{ overflow: 'auto' }}>
                                    <table className="cus-table">
                                        <thead>
                                            <tr>
                                                <th>Mã Trường</th>
                                                <th>Tên Trường</th>
                                                <th>Tỉnh Thành</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.props.data.schools.length !== 0 ? this.genListSchool() : (
                                                <tr>
                                                    <td className="text-center" colSpan={3}>
                                                        Không có dữ liệu hiển thị
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {(this.state.page !== 1 || this.props.data.next) && <div className="col-xs-12 text-right">
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
                            </div>}
                        </div>
                    </div>
                </section>
                <Footer />
            </Fragment>
        );
    }
}

Suggest.propTypes = {
    data: PropTypes.object,
    loadSchools: PropTypes.func,
    loading: PropTypes.func,
    user: PropTypes.object
}

const mapStateToProps = state => {
    return {
        data: state.SchoolReducer,
        user: state.UserReducer.user
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadSchools: (page, province, subjectGroup) => dispatch(actions.loadSchoolSuggestApi(page, province, subjectGroup)),
        loading: loading => dispatch(load.loading(loading))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggest);