import * as actionTypes from './../actionTypes/NewActionTypes';

let initState = {
    news: [],
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

const NewReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_NEW: {
            let index = findIndex(state.news, action.myNew.id);
            if (index > -1) {
                state.news[index] = action.myNew;
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_NEW: {
            return {
                news: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_NEW_STATUS: {
            let index = findIndex(state.news, action.id);
            if (index > -1) {
                state.news[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default NewReducer;