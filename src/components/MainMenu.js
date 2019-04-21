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
            .then(curUserID => this.setState({isAuthorized:curUserID.ID}))
    }

    render() {

        console.log(this.state)

        return(
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <button className="btn-primary btn">Головна сторінка</button>
                    <button className="btn-primary btn">Кошик</button>
                    <button className="btn-primary btn" onClick={this.login}>війти</button>
                    <button className="btn-primary btn">реєстрація</button>
                </nav>

            </div>
        )
    }

    login = () => {

    /*
        fetch('http://127.0.0.1:5000/login',
            {method:'POST'})
        fetch('http://127.0.0.1:5000/getUser')
            .then(response => response.json())
            .then(data => this.setState({user:data.user}))*/
    }

    logout = () => {
        fetch('http://127.0.0.1:5000/logout',
            {method:'POST'})
        fetch('http://127.0.0.1:5000/getUser')
            .then(response => response.json())
            .then(data => this.setState({user:data.user}))
    }
}

export default MainMenu