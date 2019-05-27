import {START_EDIT_PROFILE, END_EDIT_PROFILE} from '../constans'

let editProfileReducer = (state = {editingStarted: 0}, action) => {

    switch(action.type) {
        case START_EDIT_PROFILE:
            return {editingStarted: 1};
        case END_EDIT_PROFILE:
            return {editingStarted: 0};
        default:
            return state;
    }
};

export default editProfileReducer;

