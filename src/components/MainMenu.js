import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import "./StyleMainMenu.css"

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
                    <li style={{float:'left'}}> <div className="main"></div></li>
                    <li> <div>basket</div></li>
                    {this.state.isAuthorized ? (
                        <span>
                            <li> <div>profile</div></li>
                            <li> <div onClick={this.logout}>exit</div></li>
                        </span>
                        ): (
                        <span>
                            <li> <div onClick={this.login}>log in</div></li>
                            <li> <div>sign up</div></li>
                        </span>
                        )
                    }
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