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
import Select from 'react-select';
import * as actionsMajor from '../../actions/MajorActions';
import * as actionsProvince from '../../actions/ProvinceActions';
import * as actionsSG from '../../actions/SubjectGroupActions';
import LogApi from '../../api/LogApi';

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

class Suggest2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            province: undefined,
            majorcode: undefined,
            subjectGroups: undefined,
            mark: undefined,

            provinceSelected: undefined,
            provinceOption: [],

            majorSelected: undefined,
            majorOptions: [],

            subjectGroupSelected: undefined,
            subjectGroupOptions: []
        }
    }

    async componentDidMount() {
        init_all();
        await this.initFilter(qs.parse(this.props.location.search));
        if (this.props.majors.length === 0) {
            this.props.loadAllMajor();
        } else {
            this.initMajorOptions(this.props.majors);
        }
        if (this.props.provinces.length === 0) {
            this.props.loadAllProvince();
        } else {
            this.initProvinceOptions(this.props.provinces);
        }
        if (this.props.subjectGroups.length === 0) {
            this.props.loadAllSubjectGroup();
        } else {
            this.initSGOptions(this.props.subjectGroups);
        }
        this.loadSchools();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            await this.initFilter(qs.parse(nextProps.location.search));
            this.loadSchools();
        }
        if (this.props.majors !== nextProps.majors) {
            this.initMajorOptions(nextProps.majors);
        }
        if (this.props.provinces !== nextProps.provinces) {
            this.initProvinceOptions(nextProps.provinces);
        }
        if (this.props.subjectGroups !== nextProps.subjectGroups) {
            this.initSGOptions(nextProps.subjectGroups);
        }
    }

    initFilter = filter => {
        let { page, province, subjectGroups, mark, majorcode } = filter;
        page = Number(page) || 1;
        page = page < 0 ? 1 : page;
        this.setState({ page, province, subjectGroups, mark, majorcode });
    }

    pushUrl = page => {
        let { province, subjectGroups, mark, majorcode } = this.state;
        page = page ? page : this.state.page;
        let query = '?';
        query += page ? ('page=' + page) : '';
        query += province ? ('&province=' + province) : '';
        query += subjectGroups ? ('&subjectGroups=' + subjectGroups) : '';
        query += majorcode ? ('&majorcode=' + majorcode) : '';
        query += mark ? ('&mark=' + mark) : '';
        this.props.history.push(this.props.location.pathname + query);
    }

    loadSchools = () => {
        this.props.loading(true);
        let { page, province, subjectGroups, mark, majorcode } = this.state;
        this.props.loadSchools(page, province, subjectGroups, mark, majorcode).then(res => {
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

    goDetail = id => {
        let { province, subjectGroups, mark, majorcode } = this.state;
        LogApi.logView({ province, subjectGroups, mark, majorcode, school: id });
        this.props.history.push('/school/detail?id=' + id);
    }

    genListSchool = () => {
        let rs = null;
        let { schools } = this.props.data;
        if (schools) {
            rs = schools.map((el, index) => (
                <SuggestItem goDetail={() => this.goDetail(el._id || el.id)} key={index} school={el} />
            ));
        }
        return rs;
    }

    initMajorOptions = majors => {
        let majorOptions = [], majorSelected;
        let { major } = this.state;
        if (majors) {
            majorOptions = majors.map(m => ({ value: m.code, label: m.name }));
        }
        majorSelected = majorOptions.find(el => el.value === major);
        this.setState({ majorOptions, majorSelected });
    }

    initProvinceOptions = provinces => {
        let provinceOptions = [], provinceSelected;
        let { province } = this.state;
        if (provinces) {
            provinceOptions = provinces.map(p => ({ value: p.id, label: p.name }));
        }
        provinceSelected = provinceOptions.find(el => el.value === province);
        this.setState({ provinceOptions, provinceSelected });
    }

    initSGOptions = subjectGroups => {
        let subjectGroupOptions = [], subjectGroupSelected;
        let { subjectGroup } = this.state;
        if (subjectGroups) {
            subjectGroupOptions = subjectGroups.map(sg => ({ value: sg.id, label: sg.code }));
        }
        subjectGroupSelected = subjectGroupOptions.find(el => el.value === subjectGroup);
        this.setState({ subjectGroupOptions, subjectGroupSelected });
    }

    handleChangeMajor = majorSelected => {
        this.setState({ majorSelected, majorcode: majorSelected.value });
    }

    handleChangeProvince = provinceSelected => {
        this.setState({ provinceSelected, province: provinceSelected.value });
    }

    handleChangeSubjectGroup = subjectGroupSelected => {
        this.setState({ subjectGroupSelected, subjectGroups: subjectGroupSelected.value });
    }

    handeChangeInput = e => {
        let { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    suggest = e => {
        e.preventDefault();
        this.pushUrl(1);
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
                        <div className="row mb-20">
                            <div className="col-xs-12 col-lg-6 mb-30">
                                <input
                                    className="cus-input-group"
                                    type="number" name="mark"
                                    autoComplete="off"
                                    placeholder="Điểm"
                                    onChange={this.handeChangeInput}
                                />
                            </div>
                            <div className="col-xs-12 col-lg-6 mb-30">
                                <Select
                                    value={this.state.majorSelected}
                                    onChange={this.handleChangeMajor}
                                    options={this.state.majorOptions}
                                    styles={selectStyle}
                                    placeholder="Ngành học"
                                />
                            </div>
                            <div className="col-xs-12 col-lg-6 mb-30">
                                <Select
                                    value={this.state.provinceSelected}
                                    onChange={this.handleChangeProvince}
                                    options={this.state.provinceOptions}
                                    styles={selectStyle}
                                    placeholder="Tỉnh"
                                />
                            </div>
                            <div className="col-xs-12 col-lg-6 mb-30">
                                <Select
                                    value={this.state.subjectGroupSelected}
                                    onChange={this.handleChangeSubjectGroup}
                                    options={this.state.subjectGroupOptions}
                                    styles={selectStyle}
                                    placeholder="Khối thi"
                                />
                            </div>
                            <div className="col-xs-12 mb-30 text-center">
                                <a
                                    style={{ borderWidth: 1 }} href="#"
                                    className="btn btn-mod btn-border btn-large btn-round"
                                    onClick={this.suggest}
                                >Tư vấn</a>
                            </div>
                        </div>
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

Suggest2.propTypes = {
    data: PropTypes.object,
    loadSchools: PropTypes.func,
    loading: PropTypes.func,
    loadAllProvince: PropTypes.func,
    loadAllSubjectGroup: PropTypes.func,
    loadAllMajor: PropTypes.func,
    user: PropTypes.object
}

const mapStateToProps = state => {
    return {
        data: state.SchoolReducer,
        user: state.UserReducer.user,
        provinces: state.ProvinceReducer.provinces,
        majors: state.MajorReducer.majors,
        subjectGroups: state.SubjectGroupReducer.subjectGroups
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadSchools: (page, province, subjectGroup, mark, majorcode) => dispatch(actions.loadSchoolSuggestApi(page, province, subjectGroup, mark, majorcode)),
        loading: loading => dispatch(load.loading(loading)),
        loadAllMajor: () => dispatch(actionsMajor.loadAllApi()),
        loadAllProvince: () => dispatch(actionsProvince.loadProvinceApi()),
        loadAllSubjectGroup: () => dispatch(actionsSG.loadSGApi())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Suggest2);