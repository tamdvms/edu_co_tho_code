import JobApi from './../api/JobApi';
import * as actionTypes from './../actionTypes/JobActionTypes';

export const addJobApi = job => {
    return (dispatch, getState) => JobApi.add({
        job,
        session: getState().LoginReducer.session
    }).then(res => {
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateJobApi = job => {
    return (dispatch, getState) => JobApi.update({
        job,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateJobState(job));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateJobState = job => {
    return {
        type: actionTypes.UPDATE_JOB,
        job
    };
};

export const deleteJobApi = id => {
    return (dispatch, getState) => JobApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteJobState(id));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const deleteJobState = id => {
    return {
        type: actionTypes.DELETE_JOB,
        id
    };
};

export const loadAllJobApi = (page, status) => {
    return (dispatch, getState) => JobApi.getAll({
        page, status,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllJobState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });;
};

export const loadAllJobState = data => {
    return {
        type: actionTypes.LOAD_ALL_JOB,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => JobApi.updateStatus({
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
        type: actionTypes.UPDATE_JOB_STATUS,
        id, status
    }
}
