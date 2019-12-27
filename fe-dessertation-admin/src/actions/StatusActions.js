import * as actionTypes from '../actionTypes/StatusActionTypes';
import statusApi from './../api/StatusApi';

export const loadAllStatusApi = page => {
    return (dispatch, getState) => statusApi.getAll({
        page,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllStatusState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const loadAllStatusState = data => {
    return {
        type: actionTypes.LOAD_ALL_STATUS,
        data
    };
};