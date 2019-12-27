import subjectApi from './../api/SubjectApi';
import * as actionTypes from './../actionTypes/SubjectActionTypes';

export const addSubjectApi = subject => {
    return (dispatch, getState) => subjectApi.add({
        subject,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(addSubjectState(subject));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const addSubjectState = subject => {
    return {
        type: actionTypes.ADD_SUBJECT,
        subject
    };
};

export const updateSubjectApi = subject => {
    return (dispatch, getState) => subjectApi.update({
        subject,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateSubjectState(subject));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateSubjectState = subject => {
    return {
        type: actionTypes.UPDATE_SUBJECT,
        subject
    };
};

export const deleteSubjectApi = id => {
    return (dispatch, getState) => subjectApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteSubjectState(id));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const deleteSubjectState = id => {
    return {
        type: actionTypes.DELETE_SUBJECT,
        id
    };
};

export const loadAllSubjectApi = (page, status) => {
    return (dispatch, getState) => subjectApi.getAll({
        page, status,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllSubjectState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const loadAllSubjectState = data => {
    return {
        type: actionTypes.LOAD_ALL_SUBJECT,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => subjectApi.updateStatus({
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
