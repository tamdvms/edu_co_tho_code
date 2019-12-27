import * as actionTypes from './../actionTypes/ProvinceActionTypes';
import ProvinceApi from './../api/ProvinceApi';

export const loadProvinceApi = page => {
    return dispatch => ProvinceApi.getAll({ page }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadProvinceState(res.body.data));
        }
        return res;
    });
}

export const loadProvinceState = data => {
    return {
        type: actionTypes.LOAD_PROVINCE,
        data
    }
}