import * as actionTypes from './../actionTypes/MajorActionTypes';
import MajorApi from './../api/MajorApi';

export const loadAllApi = () => {
    return dispatch => MajorApi.getAll().then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllState(res.body.data));
        }
        return res;
    }).catch(error => {
        // error
    });
}

export const loadAllState = data => {
    return {
        type: actionTypes.LOAD_ALL_MAJOR_MAIN,
        data
    }
}