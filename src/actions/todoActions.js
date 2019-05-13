import {LOG_IN, LOG_OUT, START_LOGIN, END_LOGIN} from '../constans'

export const startLogIn = () => {
    return {type: START_LOGIN};
};

export const endLogIn = () => {
    return {type: END_LOGIN};
};

export const checkLogin = () => {
    return dispatch => {
        fetch("http://127.0.0.1:5000/getCurUserID",
            {
                method: "POST",
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    'token': localStorage.getItem("userToken")
                })
            })
            .then(response => response.json())
            .then(curUserID => {
                    dispatch({type: curUserID.ID !== -1 ? LOG_IN : LOG_OUT});
            })
    }
};

export const logIn = (token) => {
    console.log(token);
    localStorage.setItem('userToken', token);
    return {type: LOG_IN};
};

export const logOut = () => {
    localStorage.setItem('userToken', '');
    return {type: LOG_OUT};
};

