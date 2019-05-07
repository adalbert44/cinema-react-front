import React, {PureComponent} from 'react'
import './StyleLoginForm.css'
import {connect} from "react-redux";
import {logIn, endLogIn} from "../../actions/todoActions";
import {END_LOGIN, LOG_IN} from "../../constans";

class LoginForm extends PureComponent {
    constructor (props){
            super(props);

            this.state = {
                login: '',
                password: ''
            };

            this.handleLoginChange = this.handleLoginChange.bind(this);
            this.handlePasswordChange = this.handlePasswordChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (event) {

        fetch("http://127.0.0.1:5000/getToken",
            {  method: "POST",
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    'username': this.state.login,
                    'password': this.state.password
                })
            })
            .then(response => response.json())
            .then(data => {

                if (data.token !== '') {
                    console.log('---', data.token);
                    this.props.logIn(data.token);
                    this.props.endLogIn();
                }
            });

        event.preventDefault();
    }

    handleLoginChange (event) {
        this.setState({login:event.target.value})
    }

    handlePasswordChange (event) {
        this.setState({password:event.target.value})
    }

    render() {
        return(
            <div className="modal-window">
                <div className="dark-background" onClick={this.props.endLogIn}/>

                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="login"
                        value={this.state.login}
                        onChange={this.handleLoginChange}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                    />
                    <button onClick={this.handleSubmit} className="submit-button">LOG IN</button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isAuthorized: state.authorization.isAuthorized
    }
}

function mapDispatchProps(dispatch) {
    return {
        endLogIn: () => {
            dispatch(endLogIn());
        },
        logIn: token => {
            dispatch(logIn(token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(LoginForm)

