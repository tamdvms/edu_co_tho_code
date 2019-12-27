import provinceApi from './../api/ProvinceApi';
import * as actionTypes from './../actionTypes/ProvinceActionTypes';

export const addProvinceApi = province => {
    return (dispatch, getState) => provinceApi.add({
        province,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(addProvinceState(province)); ``
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const addProvinceState = province => {
    return {
        type: actionTypes.ADD_PROVINCE,
        province
    };
};

export const updateProvinceApi = province => {
    return (dispatch, getState) => provinceApi.update({
        province,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateProvinceState(province));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const updateProvinceState = province => {
    return {
        type: actionTypes.UPDATE_PROVINCE,
        province
    };
};

export const deleteProvinceApi = id => {
    return (dispatch, getState) => provinceApi.delete({
        id,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteProvinceState(id));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const deleteProvinceState = id => {
    return {
        type: actionTypes.DELETE_PROVINCE,
        id
    };
};

export const loadAllProvinceApi = (page, status, sector) => {
    return (dispatch, getState) => provinceApi.getAll({
        page, status, sector,
        session: getState().LoginReducer.session
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllProvinceState(res.body.data));
        }
        return res.body.code;
    }).catch(error => {
        throw (error);
    });
};

export const loadAllProvinceState = data => {
    return {
        type: actionTypes.LOAD_ALL_PROVINCE,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => provinceApi.updateStatus({
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
        type: actionTypes.UPDATE_STATUS,
        id,
        status
    }
}
