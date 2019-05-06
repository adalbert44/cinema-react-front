import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import "./StyleMainMenu.css"
import logo from "./textures/logo.png"
import basket from "./textures/noun_basket_129154.png"
import log_out from "./textures/noun_Exit_1680412.png"
import log_in from "./textures/noun_log in_1680411.png"
import profile from "./textures/noun_profile_736746.png"
import sign_up from "./textures/noun_Sign Up_736746.png"

class MainMenu extends Component {

    
    constructor(props) {
        super(props)

        this.state = {
            isMouseOnImg:false
        }

        fetch("http://127.0.0.1:5000/getCurUserID",
            {  method: "POST",
                    headers: new Headers({
                        'content-type': 'application/json'
                    }),
                    body: JSON.stringify({
                        'token': localStorage.getItem("userToken")
                    })
                })
            .then(response => response.json())
            .then(curUserID => this.setState({isAuthorized:curUserID.ID !== -1}))
    }

    render() {


        return(
                <ul>
                    <li style={{float:'left', width: "100px"}} > <img className="main" alt="tutu" src={logo}/></li>
                    {this.state.isAuthorized ? (
                        <span>
                            <li onClick={this.logout}> <img alt="tutu" src={log_out}/></li>
                            <li> <img alt="tutu" src={profile}/></li>
                        </span>
                        ): (
                        <span>
                            <li onClick={this.login}> <img alt="tutu" src={log_in}/></li>
                            <li> <img alt="tutu" src={sign_up}/></li>
                        </span>
                        )
                    }
                    <li> <img alt="tutu" src={basket}/></li>

                </ul>
        )
    }

    login = () => {

        fetch("http://127.0.0.1:5000/getToken",
            {  method: "POST",
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    'username': 'uu',
                    'password': 'pp'
                })
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('userToken', data.token)
                this.setState({
                    isAuthorized: 1
                })
            })
    }

    logout = () => {
        localStorage.setItem('userToken', '')
        this.setState({
            isAuthorized: 0
        })
    }
}

export default MainMenu