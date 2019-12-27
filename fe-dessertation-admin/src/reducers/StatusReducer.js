import * as actionTypes from './../actionTypes/StatusActionTypes';

let initState = {
    status: [],
    next: false
}

const StatusReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_ALL_STATUS: {
            return {
                status: action.data.list,
                next: action.data.next
            };
        }
        default: {
            return { ...state };
        }
    }
}

export default StatusReducer;