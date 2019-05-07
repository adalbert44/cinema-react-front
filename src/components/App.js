import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import MainMenu from './MainMenu'
import FilmSlider from "./FilmSlider/FilmSlider";
import LoginForm from "./LoginForm/LoginForm";
import "./StyleApp.css"
import {connect, Provider} from "react-redux";
import store from '../store'
import {checkLogin} from "../actions/todoActions";

class App extends Component {
    constructor(props) {
        super(props);

        this.props.checkLogin()
    }

    render() {
        return (

            <div className="merger">
                <div id = "menuField">
                    <Provider store={store}>
                        <MainMenu/>
                    </Provider>
                </div>
                <div id = "sliderField">
                    <FilmSlider/>
                </div>
                {this.props.loginStarted && <LoginForm/>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuthorized: state.authorization.isAuthorized,
        loginStarted: state.modalWindow.loginStarted
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