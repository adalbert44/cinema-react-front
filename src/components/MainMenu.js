import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import "./StyleMainMenu.css"
import logo from "./textures/logo.png"
import basket from "./textures/noun_basket_129154.png"
import log_out from "./textures/noun_Exit_1680412.png"
import log_in from "./textures/noun_log in_1680411.png"
import profile from "./textures/noun_profile_736746.png"
import sign_up from "./textures/noun_Sign Up_736746.png"
import {connect} from "react-redux"
import {checkLogin, startLogIn, logOut} from '../actions/todoActions'

class MainMenu extends Component {


    constructor(props) {
        super(props);

        this.state = {
            isMouseOnImg: false
        }
    }

    render() {
        return (
            <ul>
                <li style={{float: 'left', width: "100px"}}><img className="main" alt="tutu" src={logo}/></li>
                {this.props.isAuthorized ? (
                    <span>
                            <li onClick={this.logout}> <img alt="tutu" src={log_out}/></li>
                            <li> <img alt="tutu" src={profile}/></li>
                        </span>
                ) : (
                    <span>
                            <li onClick={this.login}> <img alt="tutu" src={log_in}/></li>
                            <li> <img alt="tutu" src={sign_up}/></li>
                        </span>
                )
                }
                <li><img alt="tutu" src={basket}/></li>

            </ul>

        )
    }

    login = () => {

        if (this.props.isAuthorized===0)
            this.props.startLogIn();
    };

    logout = () => {

        if (this.props.isAuthorized===1)
            this.props.logOut();
    }
}

function mapStateToProps(state) {
    return {
        isAuthorized: state.authorization.isAuthorized
    }
}

function mapDispatchProps(dispatch) {
    return {
        startLogIn: () => {
            dispatch(startLogIn());
        },
        logOut: () => {
            dispatch(logOut());
        },
        checkLogin: () => {
            dispatch(checkLogin());
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(MainMenu)