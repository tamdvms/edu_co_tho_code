import * as actionTypes from './../actionTypes/SubjectGroupActionTypes';
import SGApi from './../api/SubjectGroupApi';

export const loadSGApi = () => {
    return dispatch => SGApi.getAll().then(res => {
        if (res.body.code === 200) {
            dispatch(loadSGState(res.body.data));
        }
        return res;
    });
}

export const loadSGState = data => {
    return {
        type: actionTypes.LOAD_SUBJECTGROUP,
        data
    }
}