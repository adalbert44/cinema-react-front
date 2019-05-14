import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import MainMenu from './MainMenu'
import FilmSlider from "./FilmSlider/FilmSlider";
import LoginForm from "./LoginForm/LoginForm";
import SignUpForm from "./SignUpForm/SignUpForm"
import "./StyleApp.css"
import {connect, Provider} from "react-redux";
import store from '../store'
import {checkLogin} from "../actions/todoActions";
import { BrowserRouter, Route } from 'react-router-dom';
import InfoFilm from "./InfoFilm/InfoFilm";

class App extends Component {
    constructor(props) {
        super(props);

        this.props.checkLogin()
    }

    render() {
        return (
            <BrowserRouter>
            <div className="merger">
                <div id = "menuField">
                    <Provider store={store}>
                        <MainMenu/>
                    </Provider>
                </div>
                <div id = "sliderField">
                    <Route exact path='/' component={FilmSlider}/>
                    <Route path='/:id' component={InfoFilm}/>
                </div>
                {this.props.logInStarted && <LoginForm/>}
                {this.props.signUpStarted && <SignUpForm/>}
            </div>
            </BrowserRouter>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuthorized: state.authorization.isAuthorized,
        logInStarted: state.logInWindow.loginStarted,
        signUpStarted: state.signUpWindow.signUpStarted
    }
}

function mapDispatchProps(dispatch) {
    return {
        checkLogin: () => {
            dispatch(checkLogin());
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(App)