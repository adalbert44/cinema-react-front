import {LOG_IN, LOG_OUT} from '../constans'

let authorizationReducer = (state={isAuthorized: 0}, action) => {
    switch(action.type) {
        case LOG_IN:
            return {isAuthorized: 1};
        case LOG_OUT:
            return {isAuthorized: 0};
        default:
            return state;
    }
};

export default authorizationReducer;
