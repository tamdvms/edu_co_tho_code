import * as actions from './../actionTypes/ProvinceActionTypes';

const intitState = {
    provinces: [],
    next: false
}

const ProvinceReducer = (state = intitState, action) => {
    switch (action.type) {
        case actions.LOAD_PROVINCE: {
            return {
                provinces: action.data.list,
                next: action.data.next
            }
        }
        default: {
            return { ...state };
        }
    }
}

export default ProvinceReducer;