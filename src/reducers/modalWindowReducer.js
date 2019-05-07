import {START_LOGIN, END_LOGIN} from '../constans'

let modalWindowReducer = (state = {loginStarted: 0}, action) => {
    console.log(action.type);
    switch(action.type) {
        case START_LOGIN:
            return {loginStarted: 1};
        case END_LOGIN:
            return {loginStarted: 0};
        default:
            return state;
    }
};

export default modalWindowReducer;

