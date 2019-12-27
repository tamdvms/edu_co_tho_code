import * as actionTypes from './../actionTypes/SubjectActionTypes';

let initState = {
    subjects: [],
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

const subjectReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_SUBJECT: {
            state.subjects.push(action.subject);
            return { ...state };
        }
        case actionTypes.UPDATE_SUBJECT: {
            let index = findIndex(state.subjects, action.subject.id);
            if (index > -1) {
                state.subjects[index] = action.subject;
            }
            return { ...state };
        }
        case actionTypes.DELETE_SUBJECT: {
            let index = findIndex(state.subjects, action.id);
            console.log(index);
            if (index > -1) {
                state.subjects.splice(index, 1);
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_SUBJECT: {
            return {
                subjects: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_STATUS: {
            let index = findIndex(state.subjects, action.id);
            if (index > -1) {
                state.subjects[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default subjectReducer;