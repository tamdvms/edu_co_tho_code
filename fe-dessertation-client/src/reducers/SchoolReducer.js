import * as actions from './../actionTypes/SchoolActionTypes';

const intitState = {
    schools: [],
    next: false
}

const SchoolReducer = (state = intitState, action) => {
    switch (action.type) {
        case actions.LOAD_SCHOOL: {
            return {
                schools: action.data.list,
                next: action.data.next
            }
        }
        case actions.CLEAR_SCHOOL: {
            return {
                schools: [],
                next: false
            }
        }
        default: {
            return { ...state };
        }
    }
}

export default SchoolReducer;