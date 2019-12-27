import * as actionTypes from "./../actionTypes/MarkActionTypes";

let initState = {
    marks: [],
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

const markReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_MARK: {
            state.marks.push(action.mark);
            return { ...state };
        }
        case actionTypes.UPDATE_MARK: {
            let index = findIndex(state.marks, action.mark.id);
            if (index > -1) {
                state.marks[index] = action.mark;
            }
            return { ...state };
        }
        case actionTypes.DELETE_MARK: {
            let index = findIndex(state.marks, action.id);
            if (index > -1) {
                state.marks.splice(index, 1);
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_MARK: {
            return {
                marks: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_STATUS: {
            let index = findIndex(state.marks, action.id);
            if (index > -1) {
                state.marks[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default markReducer;