import * as actionTypes from './../actionTypes/MediaActionTypes';

let initState = {
    medias: [],
    next: false
}

const MediaReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_LIST_MEDIA: {
            return {
                medias: action.data.list,
                next: action.data.next
            }
        }
        default: {
            return state;
        }
    }
};

export default MediaReducer;