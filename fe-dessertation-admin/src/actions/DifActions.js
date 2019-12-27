import * as actionTypes from './../actionTypes/DifActionTypes';

export const changeLoading = loading => {
    return {
        type: actionTypes.LOADING,
        loading
    };
};