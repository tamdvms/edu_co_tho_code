import * as actionTypes from './../actionTypes/UserActionTypes';

let initState = {
    users: [],
    next: false
}

function findIndex(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_USER: {
            state.users.push(action.user);
            return { ...state };
        }
        case actionTypes.UPDATE_USER: {
            let index = findIndex(state.users, action.user.id);
            if (index > -1) {
                state.users[index] = action.user;
            }
            return { ...state };
        }
        case actionTypes.DELETE_USER: {
            let index = findIndex(state.users, action.id);
            if (index > -1) {
                state.users.splice(index, 1);
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_USER: {
            return {
                users: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_STATUS: {
            let index = findIndex(state.users, action.id);
            if (index > -1) {
                state.users[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default userReducer;