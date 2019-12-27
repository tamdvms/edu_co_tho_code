import * as actionTypes from './../actionTypes/MediaActionTypes';
import MediaApi from '../api/MediaApi';

export const loadListApi = (page, extensions, status) => {
    return (dispatch, getState) => MediaApi.getList({
        page, extensions, status,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadListState(res.body.data));
        }
        return res;
    }).catch(error => {
        throw (error);
    });
};

export const loadListState = data => {
    return {
        type: actionTypes.LOAD_LIST_MEDIA,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => MediaApi.updateStatus({
        id,
        status: status.id,
        session: getState().LoginReducer.session
    }).then(res => {
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};