import * as actions from './../actionTypes/NewActionTypes';

const intitState = {
    news: [],
    next: false
}

const NewReducer = (state = intitState, action) => {
    switch (action.type) {
        case actions.LOAD_NEW: {
            return {
                news: action.data.list,
                next: action.data.next
            }
        }
        default: {
            return { ...state };
        }
    }
}

export default NewReducer;