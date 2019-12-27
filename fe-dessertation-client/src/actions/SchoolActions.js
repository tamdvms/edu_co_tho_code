import * as actionTypes from './../actionTypes/SchoolActionTypes';
import SchoolApi from './../api/SchoolApi';

export const loadSchoolApi = param => {
    return dispatch => SchoolApi.getAll(param).then(res => {
        if (res.body.code === 200) {
            dispatch(loadSchooState(res.body.data));
        }
        return res;
    });
}

export const loadSchoolSuggestApi = (page, province, subjectGroups, mark, majorcode) => {
    return dispatch => SchoolApi.getSuggest({ page, province, subjectGroups, mark, majorcode }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadSchooState(res.body.data));
        }
        return res;
    });
}

export const loadSchooState = data => {
    return {
        type: actionTypes.LOAD_SCHOOL,
        data
    }
}

export const clearSchool = () => {
    return {
        type: actionTypes.CLEAR_SCHOOL
    }
}