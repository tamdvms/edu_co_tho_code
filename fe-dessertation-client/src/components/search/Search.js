import React, { Component, Fragment } from 'react';
import Footer from './../common/Footer';
import { connect } from 'react-redux';
import * as actions from './../../actions/SchoolActions';
import Nav from '../common/Nav';
import { init_all } from '../../assets/js/all';
import qs from 'query-string';
import PropTypes from 'prop-types';
import SchoolItem from '../school/SchooItem';
import * as load from '../../actions/LoadingActions';
import Select from 'react-select';
import * as actionsMajor from '../../actions/MajorActions';

const TYPE_SCHOOL = 'SCHOOL';
const TYPE_MAJOR = 'MAJOR';

const selectStyle = {
    control: (base) => ({
        ...base,
        minHeight: 46,
        borderRadius: 0,
        boxShadow: "none",
        outline: "none",
        border: "1px solid rgba(0,0,0, .1)",
        '&:hover': {
            borderColor: "#00000033"
        },
        backgroundColor: 'white'
    }),
    dropdownIndicator: base => ({
        ...base,
        paddingLeft: 15,
        paddingRight: 15
    }),
    menu: (base) => ({
        ...base,
        zIndex: 100,
        border: "0px !important",
    }),
    menuList: base => ({
        ...base,
        zIndex: 100,
    })
}

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            label: 'Tìm kiếm nâng cao',
            keyword: '',
            type: TYPE_SCHOOL,
            majorOptions: [],
            majorSelected: undefined,
            code: undefined
        }
    }

    async componentDidMount() {
        init_all();
        await this.initFilter(qs.parse(this.props.location.search));
        if (this.props.majors.length === 0) {
            this.props.loadAllMajor();
        } else {
            this.initSelectOptions(this.props.majors);
        }
        this.loadSchools();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadSchools();
        }
        if (this.props.majors !== nextProps.majors) {
            this.initSelectOptions(nextProps.majors);
        }
    }

    initSelectOptions = majors => {
        let majorOptions = [], majorSelected;
        let { code } = this.state;
        if (majors) {
            majorOptions = majors.map(m => ({ value: m.code, label: m.name }));
        }
        majorSelected = majorOptions.find(el => el.value === code);
        this.setState({ majorOptions, majorSelected });
    }

    handeChangeInput = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    toggleAdvSearch = e => {
        e.preventDefault();
        let { label } = this.state;
        label = 'Tìm kiếm nâng cao' === label ? 'Ẩn tìm kiếm nâng cao' : 'Tìm kiếm nâng cao';
        this.setState({ label }, () => {
            $('#adv-search').toggle(500);
        });
    }

    initFilter = filter => {
        let { page, keyword, type, code } = filter;
        page = Number(page) || 1;
        keyword = keyword ? keyword : '';
        type = type ? type : TYPE_SCHOOL
        this.setState({ keyword, page, type, code });
    }

    pushUrl = type => {
        let { page, keyword, code } = this.state;
        type = type ? type : this.state.type;
        let query = '?';
        query += page ? ('page=' + page) : '';
        query += type ? ('&type=' + type) : '';
        if (type === TYPE_SCHOOL) {
            query += keyword ? ('&keyword=' + keyword) : '';
        } else {
            query += code ? ('&code=' + code) : '';
        }
        this.props.history.push(this.props.location.pathname + query);
    }

    search = e => {
        e.preventDefault();
        this.setState({ page: 1 }, () => this.pushUrl(TYPE_SCHOOL));
    }

    loadSchools = () => {
        this.props.loading(true);
        let { page, type, keyword, code } = this.state;
        let param = { page, type };
        if (type === TYPE_SCHOOL) {
            param.name = keyword;
        } else {
            param.number = code ? code : undefined;
        }
        this.props.loadSchools(param).then(res => {
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
        let { type } = this.state;
        if (schools) {
            rs = schools.map((el, index) => (
                <SchoolItem key={index} item={el} type={type} />
            ));
        }
        return rs;
    }

    enter = e => {
        if (e.keyCode === 13) {
            this.search(e);
        }
    }

    handeChangeType = () => {
        this.props.clearSchool();
        let { type } = this.state;
        type = type === TYPE_MAJOR ? TYPE_SCHOOL : TYPE_MAJOR;
        this.setState({ page: 1, id: undefined, keyword: '', majorSelected: undefined }, () => this.pushUrl(type));
    }

    handleChangeMajor = majorSelected => {
        this.setState({ majorSelected, code: majorSelected.value, page: 1 }, this.pushUrl);
    }

    render() {

        let { type } = this.state;

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
                                        <h1 className="cus-h1 mb-0">Tìm kiếm trường</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section>
                    <div className="container pt-30 pb-70">
                        <div className="row mb-40">
                            <div className="col-xs-12 col-lg-8 col-lg-offset-2">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="cus-filter-group">
                                            <div className="cus-switch"
                                                onClick={this.handeChangeType}
                                            >
                                                <div className={'cus-switch-sub' + (type === TYPE_SCHOOL ? '' : ' cus-trans')}>
                                                    Trường
                                                </div>
                                                <div className={'cus-switch-sub' + (type === TYPE_SCHOOL ? '' : ' cus-trans')}>
                                                    Ngành
                                                </div>
                                            </div>
                                            <div className="cus-search-group">
                                                {type === TYPE_SCHOOL ? <Fragment>
                                                    <input
                                                        className="cus-input-group"
                                                        type="text" name="keyword"
                                                        autoComplete="off"
                                                        placeholder="Tìm kiếm"
                                                        onChange={this.handeChangeInput}
                                                        value={this.state.keyword}
                                                        onKeyDown={this.enter}
                                                    />
                                                    <a
                                                        href="#" className="cus-button-group"
                                                        onClick={this.search}
                                                    >
                                                        <i className="fa fa-fw"></i>
                                                    </a>
                                                </Fragment> : <Select
                                                        value={this.state.majorSelected}
                                                        onChange={this.handleChangeMajor}
                                                        options={this.state.majorOptions}
                                                        styles={selectStyle}
                                                        placeholder="Ngành học"
                                                    />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row mb-40">
                            <form className="form">
                                <div className="col-xs-12 col-lg-8 col-lg-offset-2">
                                    <div className="row mb-20">
                                        <div className="col-xs- mb-20">
                                            <div className="relative">
                                                <input
                                                    type="text" name="keyword"
                                                    className="form-control input-lg"
                                                    placeholder="Tìm kiếm"
                                                    onChange={this.handeChangeInput}
                                                    value={this.state.keyword}
                                                    onKeyDown={this.enter}
                                                    autoComplete="off"
                                                />
                                                <a
                                                    href="#" className="cus-search"
                                                    onClick={this.search}
                                                >
                                                    <i className="fa fa-fw"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row" id="adv-search" style={{ display: 'none' }}>
                                        <div className="col-xs-12 col-lg-4 mb-20">
                                            <select className="form-control input-lg">
                                                <option>One</option>
                                                <option>Two</option>
                                                <option>Three</option>
                                            </select>
                                        </div>
                                        <div className="col-xs-12 col-lg-4 mb-20">
                                            <select className="form-control input-lg">
                                                <option>One</option>
                                                <option>Two</option>
                                                <option>Three</option>
                                            </select>
                                        </div>
                                        <div className="col-xs-12 col-lg-4 mb-20">
                                            <select className="form-control input-lg">
                                                <option>One</option>
                                                <option>Two</option>
                                                <option>Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row" style={{ display: 'none' }}>
                                        <div className="col-xs-12">
                                            <div className="pull-right">
                                                <a href="#" id="adv-toggle" onClick={this.toggleAdvSearch}>{this.state.label}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div> */}
                        <div className="row">
                            <div className="col-xs-12 text-center">
                                <h2>KẾT QUẢ TÌM KIẾM</h2>
                            </div>
                            <div className="col-xs-12">
                                <div style={{ overflow: 'auto' }}>
                                    <table className="cus-table">
                                        <thead>
                                            {type === TYPE_SCHOOL ? <tr>
                                                <th>Mã Trường</th>
                                                <th>Tên Trường</th>
                                                <th>Tỉnh Thành</th>
                                            </tr> : <tr>
                                                    <th>Tên Trường</th>
                                                    <th>Tỉnh thành</th>
                                                    <th>Ngành</th>
                                                    <th>Điểm</th>
                                                </tr>}
                                        </thead>
                                        <tbody>
                                            {this.props.data.schools.length !== 0 ? this.genListSchool() : (
                                                <tr>
                                                    <td className="text-center" colSpan={type === TYPE_SCHOOL ? 3 : 4}>
                                                        Không tìm thấy trường
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

Search.propTypes = {
    data: PropTypes.object,
    loadSchools: PropTypes.func,
    loading: PropTypes.func,
    loadAllMajor: PropTypes.func,
    majors: PropTypes.array,
}

const mapStateToProps = state => {
    return {
        data: state.SchoolReducer,
        majors: state.MajorReducer.majors
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadSchools: (page, keyword) => dispatch(actions.loadSchoolApi(page, keyword)),
        loading: loading => dispatch(load.loading(loading)),
        loadAllMajor: () => dispatch(actionsMajor.loadAllApi()),
        clearSchool: () => dispatch(actions.clearSchool())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);