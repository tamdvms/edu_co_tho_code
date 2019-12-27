import * as actions from './../actionTypes/MajorActionTypes';

const intitState = {
    majors: [],
    next: false
}

const MajorReducer = (state = intitState, action) => {
    switch (action.type) {
        case actions.LOAD_ALL_MAJOR_MAIN: {
            return {
                majors: action.data.list,
                next: action.data.next
            }
        }
        default: {
            return { ...state };
        }
    }
}

export default MajorReducer;