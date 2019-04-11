import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'

class MainMenu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: true
        }

        fetch('http://127.0.0.1:5000/getUser')
            .then(response => response.json())
            .then(data => this.setState({user:data.user}))
    }

    render() {

        console.log(this.state.user)

        if (this.state.user) {
            return(
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <button className="btn-primary btn">Головна сторінка</button>
                        <button className="btn-primary btn">Кошик</button>
                        <button className="btn-primary btn">Профіль</button>
                        <button className="btn-primary btn" onClick={this.logout}>Вихід</button>
                    </nav>

                </div>
            )
        } else {
            return(
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <button className="btn-primary btn">Головна сторінка</button>
                        <button className="btn-primary btn">Кошик</button>
                        <button className="btn-primary btn" onClick={this.login}>Вхід</button>
                        <button className="btn-primary btn">Реєстрація</button>
                    </nav>

                </div>
            )
        }
    }

    login = () => {
        fetch('http://127.0.0.1:5000/login',
            {method:'POST'})
        this.setState({user:true})
    }

    logout = () => {
        fetch('http://127.0.0.1:5000/logout',
            {method:'POST'})
        this.setState({user:false})
    }
}

export default MainMenu
