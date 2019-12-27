import * as actionTypes from "./../actionTypes/MajorActionTypes";

let initState = {
    majors: [],
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

const majorReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_MAJOR: {
            state.majors.push(action.major);
            return { ...state };
        }
        case actionTypes.UPDATE_MAJOR: {
            let index = findIndex(state.majors, action.major.id);
            if (index > -1) {
                state.majors[index] = action.major;
            }
            return { ...state };
        }
        case actionTypes.DELETE_MAJOR: {
            let index = findIndex(state.majors, action.id);
            if (index > -1) {
                state.majors.splice(index, 1);
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_MAJOR: {
            return {
                majors: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_STATUS: {
            let index = findIndex(state.majors, action.id);
            if (index > -1) {
                state.majors[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default majorReducer;