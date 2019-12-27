import * as actionTypes from "./../actionTypes/ProvinceActionTypes";

let initState = {
    provinces: [],
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

const provinceReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.ADD_PROVINCE: {
            state.provinces.push(action.province);
            return { ...state };
        }
        case actionTypes.UPDATE_PROVINCE: {
            let index = findIndex(state.provinces, action.province.id);
            if (index > -1) {
                state.provinces[index] = action.province;
            }
            return { ...state };
        }
        case actionTypes.DELETE_PROVINCE: {
            let index = findIndex(state.provinces, action.id);
            if (index > -1) {
                state.provinces.splice(index, 1);
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_PROVINCE: {
            return {
                provinces: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_STATUS: {
            let index = findIndex(state.provinces, action.id);
            if (index > -1) {
                state.provinces[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default provinceReducer;