import {START_SIGN_UP, END_SIGN_UP} from '../constans'

let logInReducer = (state = {loginStarted: 0}, action) => {
    console.log(action.type);
    switch(action.type) {
        case START_SIGN_UP:
            return {signUpStarted: 1};
        case END_SIGN_UP:
            return {signUpStarted: 0};
        default:
            return state;
    }
};

export default logInReducer;