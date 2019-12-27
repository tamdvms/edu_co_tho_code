import * as actionTypes from '../actionTypes/DifActionTypes';

let initState = {
    loading: false
};

const difReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOADING: {
            return {
                ...state,
                loading: action.loading
            };
        }
        default: {
            return { ...state };
        }
    }
}

export default difReducer;