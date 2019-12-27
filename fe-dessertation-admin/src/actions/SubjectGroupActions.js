import subjectGroupApi from './../api/SubjectGroupApi';
import * as actionTypes from './../actionTypes/SubjectGroupActionTypes';

export const addSubjectGroupApi = subjectGroup => {
    return (dispatch, getState) => subjectGroupApi.add({
        subjectGroup,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(addSubjectGroupState(subjectGroup));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const addSubjectGroupState = subjectGroup => {
    return {
        type: actionTypes.ADD_SUBJECTGROUP,
        subjectGroup
    };
};

export const updateSubjectGroupApi = subjectGroup => {
    return (dispatch, getState) => subjectGroupApi.update({
        subjectGroup,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateSubjectGroupState(subjectGroup));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateSubjectGroupState = subjectGroup => {
    return {
        type: actionTypes.UPDATE_SUBJECTGROUP,
        subjectGroup
    };
};

export const deleteSubjectGroupApi = id => {
    return (dispatch, getState) => subjectGroupApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteSubjectGroupState(id));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const deleteSubjectGroupState = id => {
    return {
        type: actionTypes.DELETE_SUBJECTGROUP,
        id
    };
};

export const loadAllSubjectGroupApi = (page, status) => {
    return (dispatch, getState) => subjectGroupApi.getAll({
        page, status,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllSubjectGroupState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const loadAllSubjectGroupState = data => {
    return {
        type: actionTypes.LOAD_ALL_SUBJECTGROUP,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => subjectGroupApi.updateStatus({
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
