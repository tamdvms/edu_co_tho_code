import * as actions from './../actionTypes/SubjectGroupActionTypes';

const intitState = {
    subjectGroups: [],
    next: false
}

const SubjectGroupReducer = (state = intitState, action) => {
    switch (action.type) {
        case actions.LOAD_SUBJECTGROUP: {
            return {
                subjectGroups: action.data.list,
                next: action.data.next
            }
        }
        default: {
            return { ...state };
        }
    }
}

export default SubjectGroupReducer;