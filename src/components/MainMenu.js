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
import {checkLogin, startLogIn, logOut, startSignUp} from '../actions/todoActions'
import {Link} from "react-router-dom";
import {LOG_IN, LOG_OUT} from "../constans";

class MainMenu extends Component {


    constructor(props) {
        super(props);

        this.state = {
            isMouseOnImg: false
        }

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isAuthorized) {
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
                    this.setState({curUserID:curUserID.ID});
                })
        }
    }

        render() {
        return (
            <ul>
                <Link to={`/cinema`}>
                    <li style={{float: 'left', width: "100px"}}><img className="main" alt="tutu" src={logo}/></li>
                </Link>
                {this.props.isAuthorized ? (
                    <span>
                        <li onClick={this.props.logOut}> <img alt="tutu" src={log_out}/></li>
                        <Link to={`/cinema/user/${this.state.curUserID}`}>
                            <li> <img alt="tutu" src={profile}/></li>
                        </Link>
                    </span>
                ) : (
                    <span>
                        <li onClick={this.props.startLogIn}> <img alt="tutu" src={log_in}/></li>
                        <li> <img alt="tutu" onClick={this.props.startSignUp} src={sign_up}/></li>
                    </span>
                )
                }
            </ul>

        )
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
        startSignUp: () => {
            dispatch(startSignUp());
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