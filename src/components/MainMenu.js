import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'

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
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button className="btn-primary btn">Головна сторінка</button>
                    <button className="btn-primary btn">Кошик</button>
                    {this.state.isAuthorized ? (
                        <div>
                            <button className="btn-primary btn">профіль</button>
                            <button className="btn-primary btn" onClick={this.logout}>вийти</button>
                        </div>
                        ): (
                        <div>
                            <button className="btn-primary btn" onClick={this.login}>війти</button>
                            <button className="btn-primary btn">реєстрація</button>
                        </div>
                        )
                    }
                </nav>

            </div>
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