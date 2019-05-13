import React, {PureComponent} from 'react'
import './StyleSignUpForm.css'
import {connect} from "react-redux";
import {signUp, endSignUp} from "../../actions/todoActions";

class SignUpForm extends PureComponent {
    constructor (props){
        super(props);

        this.state = {
            login: '',
            password: '',
            repeatPassword: '',
            email: '',
            warning: '',
            registered: false
        };

        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleRepeatPasswordChange = this.handleRepeatPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (event) {
        if (this.state.email === '') {
            this.setState({warning: 'e-mail field is empty'});
        } else if (this.state.login === '') {
            this.setState({warning: 'login field is empty'});
        } else if (this.state.password !== this.state.repeatPassword) {
            this.setState({warning: 'passwords are different'});
        } else {

            fetch("http://127.0.0.1:5000/sign_up",
                {  method: "POST",
                    headers: new Headers({
                        'content-type': 'application/json'
                    }),
                    body: JSON.stringify({
                        'username': this.state.login,
                        'password': this.state.password,
                        'email': this.state.email
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.token !== '') {
                        console.log('---', data.token);
                        if (data.status !== 'OK') {
                            this.setState({warning: data.error})
                        } else {
                            this.setState({registered: true});
                        }
                    }
                });
        }

        event.preventDefault();
    }

    handleLoginChange (event) {
        this.setState({login:event.target.value})
    }

    handleEmailChange (event) {
        this.setState({email:event.target.value})
    }

    handlePasswordChange (event) {
        this.setState({password:event.target.value})
    }
    handleRepeatPasswordChange (event) {
        this.setState({repeatPassword:event.target.value})
    }

    render() {
        return(
            <div className="modal-window">
                <div className="dark-background" onClick={this.props.endSignUp}/>
                {this.state.registered ? (
                    <div className="ok-message">
                        registration is successful, verify your e-mail
                    </div>
                ) : (
                    <form className="sign-up-form" onSubmit={this.handleSubmit}>
                        E-mail:

                        <input
                            type="email"
                            placeholder="e-mail"
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                        />
                        Login:
                        <input
                            type="text"
                            placeholder="login"
                            value={this.state.login}
                            onChange={this.handleLoginChange}
                        />
                        Password:
                        <input
                            type="password"
                            placeholder="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                        />
                        Repeat the password:
                        <input
                            type="password"
                            placeholder="repeat the password"
                            value={this.state.repeatPassword}
                            onChange={this.handleRepeatPasswordChange}
                        />
                        <button onClick={this.handleSubmit} className="submit-button">SIGN UP</button>
                        {this.state.warning !== '' ? (<div className="error-message">{this.state.warning}</div>) : null}
                    </form>
                )}

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
        endSignUp: () => {
            dispatch(endSignUp());
        },
        signUp: token => {
            dispatch(signUp(token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(SignUpForm)

