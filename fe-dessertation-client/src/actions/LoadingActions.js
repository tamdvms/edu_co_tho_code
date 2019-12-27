import * as actionTypes from './../actionTypes/LoadingActionTypes';

export const loading = loading => {
    return {
        type: actionTypes.LOADING,
        loading
    }
}