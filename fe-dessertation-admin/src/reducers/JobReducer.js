import * as actionTypes from './../actionTypes/JobActionTypes';

let initState = {
    jobs: [],
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

const JobReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_JOB: {
            let index = findIndex(state.jobs, action.job.id);
            if (index > -1) {
                state.jobs[index] = action.job;
            }
            return { ...state };
        }
        case actionTypes.LOAD_ALL_JOB: {
            return {
                jobs: action.data.list,
                next: action.data.next
            };
        }
        case actionTypes.UPDATE_JOB_STATUS: {
            let index = findIndex(state.jobs, action.id);
            if (index > -1) {
                state.jobs[index].status = action.status;
            }
            return { ...state };
        }
        default: {
            return state;
        }
    }
};

export default JobReducer;