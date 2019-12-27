import * as actionTypes from './../actionTypes/RoleActionTypes';

let initState = {
    roles: [],
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

const roleReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_ROLE: {
            state.roles.push(action.role);
            return {...state};
        }
        case actionTypes.UPDATE_ROLE: {
            let index = findIndex(state.roles, action.role.id);
            if (index > -1) {
                state.roles[index] = action.role;
            }
            return {...state};
        }
        case actionTypes.DELETE_ROLE: {
            let index = findIndex(state.roles, action.id);
            if (index > -1) {
                state.roles.splice(index, 1);
            }
            return {...state};
        }
        case actionTypes.LOAD_ALL_ROLE: {
            return {
                roles: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_STATUS: {
            let index = findIndex(state.roles, action.id);
            if (index > -1) {
                state.roles[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default roleReducer;