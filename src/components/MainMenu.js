import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'

class MainMenu extends Component {


    render() {
            return(
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <button className="btn-primary btn">Головна сторінка</button>
                        <button className="btn-primary btn">Кошик</button>
                    </nav>

                </div>
            )
    }

    login = () => {
        fetch('http://127.0.0.1:5000/login',
            {method:'POST'})
        fetch('http://127.0.0.1:5000/getUser')
            .then(response => response.json())
            .then(data => this.setState({user:data.user}))
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