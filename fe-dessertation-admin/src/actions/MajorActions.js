import majorApi from './../api/MajorApi';
import * as actionTypes from './../actionTypes/MajorActionTypes';

export const addMajorApi = major => {
    return (dispatch, getState) => majorApi.add({
        major,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(addMajorState(major));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const addMajorState = major => {
    return {
        type: actionTypes.ADD_MAJOR,
        major
    };
};

export const updateMajorApi = major => {
    return (dispatch, getState) => majorApi.update({
        major,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateMajorState(major));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateMajorState = major => {
    return {
        type: actionTypes.UPDATE_MAJOR,
        major
    };
};

export const deleteMajorApi = id => {
    return (dispatch, getState) => majorApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteMajorState(id));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const deleteMajorState = id => {
    return {
        type: actionTypes.DELETE_MAJOR,
        id
    };
};

export const loadAllMajorApi = (page, status, school) => {
    return (dispatch, getState) => majorApi.getAll({
        page, status, school,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllMajorState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const loadAllMajorState = data => {
    return {
        type: actionTypes.LOAD_ALL_MAJOR,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => majorApi.updateStatus({
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
        type: actionTypes.UPDATE_STATUS,
        id,
        status
    }
}