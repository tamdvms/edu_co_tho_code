import schoolApi from './../api/SchoolApi';
import * as actionTypes from './../actionTypes/SchoolActionTypes';

export const addSchoolApi = school => {
    return (dispatch, getState) => schoolApi.add({
        school,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(addSchoolState(school));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const addSchoolState = school => {
    return {
        type: actionTypes.ADD_SCHOOL,
        school
    };
};

export const updateSchoolApi = school => {
    return (dispatch, getState) => schoolApi.update({
        school,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateSchoolState(school));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateSchoolState = school => {
    return {
        type: actionTypes.UPDATE_SCHOOL,
        school
    };
};

export const deleteSchoolApi = id => {
    return (dispatch, getState) => schoolApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteSchoolState(id));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const deleteSchoolState = id => {
    return {
        type: actionTypes.DELETE_SCHOOL,
        id
    };
};

export const loadAllSchoolApi = (page, status, province) => {
    return (dispatch, getState) => schoolApi.getAll({
        page, status, province,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllSchoolState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const loadAllSchoolState = data => {
    return {
        type: actionTypes.LOAD_ALL_SCHOOL,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => schoolApi.updateStatus({
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
