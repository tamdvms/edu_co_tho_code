import * as actionTypes from './../actionTypes/UserActionTypes';
import UserApi from './../api/UserApi';

export const loginApi = (email, password) => {
    return dispatch => UserApi.login({ email, password }).then(res => {
        if (res.body.code === 200) {
            dispatch(loginState(res.body.data));
            localStorage.setItem('session', res.body.data.session);
        }
        return res;
    }).catch(error => {
        throw (error);
    });
}

export const loginState = data => {
    return {
        type: actionTypes.LOGIN,
        data
    }
}

export const logoutApi = () => {
    return (dispatch, getState) => UserApi.logout({
        session: getState().UserReducer.session
    }).then(res => {
        console.log(res);
        if (res.body.code === 200) {
            dispatch(logoutState());
            localStorage.setItem('session', null);
        }
    }).catch(error => {
        throw (error);
    });
}

export const logoutState = () => {
    return {
        type: actionTypes.LOGOUT
    }
}

export const registerApi = (fullName, email, gender, dob, phone, province, subjectGroup) => UserApi.register({ fullName, email, gender, dob, phone, province, subjectGroup }).then(res => {
    return res;
}).catch(error => {
    throw (error);
});

export const updateUserApi = data => {
    return dispatch => UserApi.updateUser(data).then(res => {
        return res;
    }).catch(error => {
        throw (error);
    });
}

export const updateUserState = data => {
    return {
        type: actionTypes.UPDATE_USER,
        data
    }
}

export const loginSession = session => {
    return dispatch => UserApi.loginSession({ session }).then(res => {
        if (res.body.code === 200) {
            let { user } = res.body.data;
            dispatch(loginState({ user, session }));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
}

export const loginFacebook = accessToken => {
    return dispatch => UserApi.loginFacebook({ accessToken }).then(res => {
        if (res.body.code === 200) {
            let { user } = res.body.data;
            dispatch(loginState({ user, session }));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
}