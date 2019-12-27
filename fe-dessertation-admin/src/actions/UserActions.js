import userApi from './../api/UserApi';
import * as actionTypes from './../actionTypes/UserActionTypes';

export const addUserApi = user => {
    return (dispatch, getState) => userApi.add({
        user,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(addUserState(user));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
};

export const addUserState = user => {
    return {
        type: actionTypes.ADD_USER,
        user
    };
};

export const updateUserApi = user => {
    return (dispatch, getState) => userApi.update({
        user,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateUserState(user));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
};

export const updateUserState = user => {
    return {
        type: actionTypes.UPDATE_USER,
        user
    };
};

export const deleteUserApi = id => {
    return (dispatch, getState) => userApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteUserState(id));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
};

export const deleteUserState = id => {
    return {
        type: actionTypes.DELETE_USER,
        id
    };
};

export const loadAllUserApi = (page, status, role, date) => {
    return (dispatch, getState) => userApi.getAll({
        page, status, role, date,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllUserState(res.body.data));
        }
        return res;
    }).catch(error => {
        throw (error);
    });;
};

export const loadAllUserState = data => {
    return {
        type: actionTypes.LOAD_ALL_USER,
        data
    };
};

export const loginApi = (username, password) => {
    return dispatch => userApi.login({
        username,
        password
    }).then(res => {
        if (res.body.code === 200) {
            localStorage.setItem('data', JSON.stringify(res.body.data));
            dispatch(loginState(res.body.data));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
};

export const loginState = data => {
    return {
        type: actionTypes.LOGIN,
        data
    }
}

export const logoutApi = () => {
    return (dispatch, getState) => userApi.logout({
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(logoutState());
        }
        return res;
    }).catch(error => {
        throw (error);
    });
};

export const logoutState = () => {
    localStorage.setItem('data', null);
    return {
        type: actionTypes.LOGOUT
    }
}

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => userApi.updateStatus({
        id,
        status: status.id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateStatusState(id, status));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
};

export const updateStatusState = (id, status) => {
    return {
        type: actionTypes.UPDATE_STATUS,
        id,
        status
    }
}
