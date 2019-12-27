import * as actionTypes from './../actionTypes/UserActionTypes';

let initState = {
    user: undefined,
    session: undefined
};

const loginReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN: {
            return {
                user: action.data.user,
                session: action.data.session
            };
        }
        case actionTypes.LOGOUT: {
            return {
                user: undefined,
                session: undefined
            };
        }
        default: {
            return { ...state };
        }
    }
}

export default loginReducer;