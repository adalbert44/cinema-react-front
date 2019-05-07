import {combineReducers} from "redux"
import authorizationReducer from "./authorizationReducer";
import modalWindowReducer from "./modalWindowReducer";



export default combineReducers({
    authorization: authorizationReducer,
    modalWindow: modalWindowReducer
});
