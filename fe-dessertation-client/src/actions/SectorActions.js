import sectorApi from './../api/SectorApi';
import * as actionTypes from './../actionTypes/SectorActionTypes';

export const addSectorApi = sector => {
    return dispatch => sectorApi.add({
        sector
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(addSectorState(sector));
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        throw (error);
    });
};

export const addSectorState = sector => {
    return {
        type: actionTypes.ADD_SECTOR,
        sector
    };
};

export const updateSectorApi = sector => {
    return dispatch => sectorApi.update({ sector }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateSectorState(sector));
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        throw (error);
    });
};

export const updateSectorState = sector => {
    return {
        type: actionTypes.UPDATE_SECTOR,
        sector
    };
};

export const deleteSectorApi = id => {
    return dispatch => sectorApi.delete({ id }).then(res => {
        if (res.body.code === 200) {
            dispatch(deleteSectorState(id));
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        throw (error);
    });
};

export const deleteSectorState = id => {
    return {
        type: actionTypes.DELETE_SECTOR,
        id
    };
};

export const loadAllSectorApi = page => {
    return dispatch => sectorApi.getAll({
        page,
        session: 'dd79e826f181a0ffc3c1fa9a6231af26'
    }).then(res => {
        if (res.body.code === 200) {
            dispatch(loadAllSectorState(res.body.data));
            return true;
        } else {
            return false;
        }
    }).catch(error => {
        throw (error);
    });
};

export const loadAllSectorState = data => {
    return {
        type: actionTypes.LOAD_ALL_SECTOR,
        data
    };
};

export const updateStatusApi = (id, status) => {
    return (dispatch, getState) => sectorApi.updateStatus({ id, status }).then(res => {
        if (res.body.code === 200) {
            dispatch(updateStatusState(id, status));
            return true;
        } else {
            return false;
        }
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
