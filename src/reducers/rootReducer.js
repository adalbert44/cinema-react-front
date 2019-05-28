import {combineReducers} from "redux"
import authorizationReducer from "./authorizationReducer";
import signUpReducer from "./signUpReducer"
import logInReducer from "./logInReducer";
import editProfileReducer from "./editProfileReducer"
import addPostReducer from "./addPostReducer"

export default combineReducers({
    authorization: authorizationReducer,
    logInWindow: logInReducer,
    signUpWindow: signUpReducer,
    editProfileWindow: editProfileReducer,
    addPostWindow: addPostReducer
});
