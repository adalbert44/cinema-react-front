import {combineReducers} from "redux"
import authorizationReducer from "./authorizationReducer";
import signUpReducer from "./signUpReducer"
import logInReducer from "./logInReducer";



export default combineReducers({
    authorization: authorizationReducer,
    logInWindow: logInReducer,
    signUpWindow: signUpReducer
});
