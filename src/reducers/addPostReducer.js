import {START_ADD_POST, END_ADD_POST} from '../constans'

let editProfileReducer = (state = {addingPostStarted: 0}, action) => {

    switch(action.type) {
        case START_ADD_POST:
            return {addingPostStarted: 1};
        case END_ADD_POST:
            return {addingPostStarted: 0};
        default:
            return state;
    }
};

export default editProfileReducer;

