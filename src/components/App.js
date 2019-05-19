import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import MainMenu from './MainMenu'
import FilmSlider from "./FilmSlider/FilmSlider";
import LoginForm from "./LoginForm/LoginForm";
import UserPage from "./UserPage/UserPage";
import SignUpForm from "./SignUpForm/SignUpForm"
import "./StyleApp.css"
import {connect, Provider} from "react-redux";
import store from '../store'
import {checkLogin} from "../actions/todoActions";
import { HashRouter, Route } from 'react-router-dom';
import InfoFilm from "./InfoFilm/InfoFilm";

class App extends Component {
    constructor(props) {
        super(props);

        this.props.checkLogin()
    }

    render() {
        return (
            <HashRouter>
            <div className="merger">
                <div id = "menuField">
                    <Provider store={store}>
                        <MainMenu/>
                    </Provider>
                </div>
                <div id = "sliderField">
                    <Route exact path='/' component={FilmSlider}/>
                    <Route exact path='/cinema' component={FilmSlider}/>
                    <Route path='/cinema/film/:id' component={InfoFilm}/>
                    <Route path='/cinema/user' component={UserPage}/>
                </div>
                {this.props.logInStarted && <LoginForm/>}
                {this.props.signUpStarted && <SignUpForm/>}
            </div>
            </HashRouter>
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