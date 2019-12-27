import * as actionTypes from './../actionTypes/NewActionTypes';
import NewApi from './../api/NewApi';

export const loadNewApi = page => {
    return dispatch => NewApi.getAll({ page }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadNewState(res.body.data));
        }
        return res;
    });
}

export const loadNewState = data => {
    return {
        type: actionTypes.LOAD_NEW,
        data
    }
}