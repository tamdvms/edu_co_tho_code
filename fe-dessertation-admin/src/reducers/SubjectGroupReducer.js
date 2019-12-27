import * as actionTypes from './../actionTypes/SubjectGroupActionTypes';

let initState = {
    subjectGroups: [],
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

const subjectGroupReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SUBJECTGROUP: {
            state.subjectGroups.push(action.subjectGroup);
            return { ...state };
        }
        case actionTypes.UPDATE_SUBJECTGROUP: {
            let index = findIndex(state.subjectGroups, action.subjectGroup.id);
            if (index > -1) {
                state.subjectGroups[index] = action.subjectGroup;
            }
            return { ...state };
        }
        case actionTypes.DELETE_SUBJECTGROUP: {
            let index = findIndex(state.subjectGroups, action.id);
            if (index > -1) {
                state.subjectGroups.splice(index, 1);
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_SUBJECTGROUP: {
            return {
                subjectGroups: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_STATUS: {
            let index = findIndex(state.subjectGroups, action.id);
            if (index > -1) {
                state.subjectGroups[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default subjectGroupReducer;