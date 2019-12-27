import React, { Component, Fragment } from 'react';
import Nav from '../common/Nav';
import { init_all } from '../../assets/js/all';
import Footer from '../common/Footer';
import ProvinceApi from '../../api/ProvinceApi';
import SubjectGroupApi from '../../api/SubjectGroupApi';
import { toastrOption } from '../../contants/options';
import toastr from 'toastr';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as actions from '../../actions/UserActions';
import { Redirect } from 'react-router-dom';
import * as load from '../../actions/LoadingActions';

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

class Update extends Component {

    componentDidMount() {
        if (!this.props.data.user) {
            return this.props.history.push('/');
        } else {
            let { fullName, sex, email, birthday, province, purpose, password, phonenumber } = this.props.data.user;
            birthday = moment(birthday);
            this.setState({ fullName, sex, email, birthday, province: province ? province.id : undefined, purpose: purpose.id, password, phonenumber, passwordcfm: password });
        }
        init_all();
        this.loadProvinces();
        this.loadSubjectGroups();
    }

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            sex: 'male',
            birthday: undefined,
            email: '',
            phonenumber: '',
            province: '',
            purpose: '',

            provinceOptions: [],
            provinceSelecled: undefined,
            subjectGroupOptions: [],
            subjectGroupSelected: undefined,

            mesEmail: '',
            mesBirthday: '',
            mesSG: '',
            mesPhone: '',
            mesName: ''
        }

        toastr.options = toastrOption;

        this.MES_EMPTY = 'Trường này không được để trống!';

        this.PHONES = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039',
            '090', '093', '070', '079', '077', '076', '078', '091', '094', '083', '084', '085', '081', '082',
            '092', '056', '058', '099', '059'];
    }

    handleChangeInput = (e) => {
        let { value, name } = e.target;
        // check length phone number
        if (name === 'phonenumber' && value.length > 10) {
            return;
        }
        this.setState({
            [name]: value
        });
    }

    loadProvinces = async () => {
        let rs = await ProvinceApi.getAll();
        let provinceSelecled, provinceOptions = rs.body.list.map(el => ({ value: el.id, label: el.name }));
        provinceSelecled = provinceOptions.find(el => el.value === this.state.province);
        this.setState({ provinceOptions, provinceSelecled });
    }

    loadSubjectGroups = async () => {
        let rs = await SubjectGroupApi.getAll();
        let subjectGroupSelected, subjectGroupOptions = rs.body.data.list.map(el => ({ value: el.id, label: el.code }));
        subjectGroupSelected = subjectGroupOptions.find(el => el.value === this.state.purpose);
        this.setState({ subjectGroupOptions, subjectGroupSelected });
    }

    update = e => {
        this.props.loading(true);
        e.preventDefault();
        let { fullName, sex, birthday, province, purpose } = this.state;
        let check = this.checkName(fullName) && this.checkBirthday(birthday) && this.checkSG(purpose);
        if (!check) {
            return;
        }
        let session, user;
        user = { id: this.props.data.user.id, fullName, sex, birthday: birthday._d, province, purpose };
        session = this.props.data.session;
        this.props.updateUser({ session, user }).then(res => {
            if (res.body.code === 200) {
                let u = res.body.data.user;
                u.province = { id: province, name: this.state.provinceSelecled.label };
                u.purpose = { id: purpose, code: this.state.subjectGroupSelected.label };
                this.props.updateUserState(u);
                toastr.success('Cập nhật thông tin thành công!');
                this.props.history.push("/user/profile");
            } else {
                toastr.error('Có lỗi xảy ra vui lòng thử lại sau!');
            }
            this.props.loading(false);
        }).catch(error => {
            // error
            console.log(error);
            this.props.loading(false);
        });
    }

    handleChangeProvince = provinceSelecled => {
        this.setState({ provinceSelecled, province: provinceSelecled.value });
    }

    handleChangeSubjectGroup = subjectGroupSelected => {
        this.setState({ subjectGroupSelected, purpose: subjectGroupSelected.value });
    }

    handleChangeBirthday = birthday => {
        // Ngày sinh tối thiểu là ngày hiện tại
        if (birthday._d < new Date()) {
            this.setState({ birthday });
        }
    }

    // validdate input

    checkBirthday = birthday => {
        if (!birthday) {
            this.setState({ mesBirthday: this.MES_EMPTY });
            return false;
        } else {
            return true;
        }
    }

    checkEmail = email => {
        let mesEmail = '', check = false;
        if (email === '') {
            mesEmail = this.MES_EMPTY;
        } else {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            check = re.test(String(email).toLowerCase());
            if (!check) {
                mesEmail = 'Email không hợp lệ!';
            }
        }
        this.setState({ mesEmail });
        return check;
    }

    checkPhone = phone => {
        let mesPhone = '', check = false;
        if (phone !== '' && (phone.length !== 10 || !this.PHONES.find(el => el === phone.substr(0, 3)))) {
            mesPhone = 'Số điện thoại không hợp lệ!';
        } else {
            check = true;
        }
        this.setState({ mesPhone });
        return check;
    }

    checkSG = subjectGroup => {
        if (subjectGroup === '') {
            this.setState({ mesSG: this.MES_EMPTY });
            return false;
        } else {
            return true;
        }
    }

    checkName = name => {
        if (name === '') {
            this.setState({ mesName: this.MES_EMPTY });
            return false;
        }
        return true;
    }

    render() {
        let { user } = this.props.data;
        if (!user) {
            return <Redirect to={{
                pathname: '/login',
                state: {
                    path: '/user/update'
                }
            }} />
        }
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
                                        <h1 className="cus-h1 mb-0">Cập nhật thông tin</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="container">
                    <div style={{ padding: '70px 0' }}>
                        <div className="row form">
                            <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                                <div className="row">
                                    <div className="col-xs-12 mb-40">
                                        <div className="cus-mes">
                                            {this.state.mesName}
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={'form-control input-lg' + (this.state.mesName !== '' ? ' cus-error-field' : '')}
                                            placeholder="Họ & Tên (*)"
                                            onChange={this.handleChangeInput}
                                            onClick={() => this.setState({ mesName: '' })}
                                            value={this.state.fullName}
                                        />
                                    </div>
                                    <div className="col-xs-12 mb-40">
                                        <div className="row text-center">
                                            <div className="col-xs-4">
                                                <label className="radio-inline">
                                                    <input checked={this.state.sex === 'male' ? true : false} type="radio" name="sex" value="male" onChange={this.handleChangeInput} /> Nam
                                                </label>
                                            </div>
                                            <div className="col-xs-4">
                                                <label className="radio-inline">
                                                    <input checked={this.state.sex === 'female' ? true : false} type="radio" name="sex" value="female" onChange={this.handleChangeInput} /> Nữ
                                                </label>
                                            </div>
                                            <div className="col-xs-4">
                                                <label className="radio-inline">
                                                    <input checked={this.state.sex === 'dif' ? true : false} type="radio" name="sex" value="dif" onChange={this.handleChangeInput} /> Khác
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 mb-40">
                                        <div className="cus-mes">
                                            {this.state.mesBirthday}
                                        </div>
                                        <div
                                            onClick={() => this.setState({ mesBirthday: '' })}
                                        >
                                            <DatePicker
                                                selected={this.state.birthday}
                                                onChange={this.handleChangeBirthday}
                                                className={'form-control input-lg' + (this.state.mesBirthday !== '' ? ' cus-error-field' : '')}
                                                dateFormat="DD/MM/YYYY"
                                                placeholderText="Ngày sinh (*)"
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 mb-40">
                                        <div className="cus-mes">
                                            {this.state.mesSG}
                                        </div>
                                        <div
                                            style={{ border: '1px solid transparent' }}
                                            className={this.state.mesSG !== '' ? ' cus-error-field' : ''}
                                            onClick={() => this.setState({ mesSG: '' })}
                                        >
                                            <Select
                                                value={this.state.subjectGroupSelected}
                                                onChange={this.handleChangeSubjectGroup}
                                                options={this.state.subjectGroupOptions}
                                                styles={selectStyle}
                                                placeholder="Khối thi (*)"
                                                onClick={() => this.setState({ mesSG: '' })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 mb-40">
                                        <Select
                                            value={this.state.provinceSelecled}
                                            onChange={this.handleChangeProvince}
                                            options={this.state.provinceOptions}
                                            styles={selectStyle}
                                            placeholder="Tỉnh thành"
                                        />
                                    </div>
                                    <div className="col-xs-12 mb-40 text-center">
                                        <a
                                            href="#"
                                            className="btn btn-mod btn-border btn-large btn-round"
                                            onClick={this.update}
                                        >
                                            Cập nhật
                                        </a>
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

Update.propTypes = {
    data: PropTypes.object,
    updateUser: PropTypes.func,
    updateUserState: PropTypes.func,
    loading: PropTypes.func,
    login: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        data: state.UserReducer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        updateUser: data => dispatch(actions.updateUserApi(data)),
        login: data => dispatch(actions.loginState(data)),
        loading: loading => dispatch(load.loading(loading)),
        updateUserState: data => dispatch(actions.updateUserState(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Update);