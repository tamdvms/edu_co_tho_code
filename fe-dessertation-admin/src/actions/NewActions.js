import newApi from './../api/NewApi';
import * as actionTypes from './../actionTypes/NewActionTypes';

export const addNewApi = myNew => {
    return (dispatch, getState) => newApi.add({
        myNew,
        session: getState().LoginReducer.session
    }).then(res => {
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateNewApi = myNew => {
    return (dispatch, getState) => newApi.update({
        myNew,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateNewState(myNew));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateNewState = myNew => {
    return {
        type: actionTypes.UPDATE_NEW,
        myNew
    };
};

export const deleteNewApi = id => {
    return (dispatch, getState) => newApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteNewState(id));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const deleteNewState = id => {
    return {
        type: actionTypes.DELETE_NEW,
        id
    };
};

export const loadAllNewApi = (page, status) => {
    return (dispatch, getState) => newApi.getAll({
        page, status,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllNewState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });;
};

export const loadAllNewState = data => {
    return {
        type: actionTypes.LOAD_ALL_NEW,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => newApi.updateStatus({
        id,
        status: status.id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateStatusState(id, status));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateStatusState = (id, status) => {
    return {
        type: actionTypes.UPDATE_NEW_STATUS,
        id,
        status
    }
}
