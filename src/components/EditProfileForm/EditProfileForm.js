import React, {PureComponent} from 'react'
import './StyleEditProfileForm.css'
import {connect} from "react-redux";
import {logIn, endEditProfile} from "../../actions/todoActions";

class EditProfileForm extends PureComponent {
    constructor (props){
            super(props);

            this.state = {
                login: '',
                password: '',
                newPassword: '',
                repeatNewPassword: '',
                photoURL: '',
                email: '',
                warning: ''
            };

            fetch("http://127.0.0.1:5000/get_user/" + this.props.ID,
                {
                    method: "POST",
                    headers: new Headers({
                        'content-type': 'application/json'
                    })
                })
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        login: data.result.username,
                        photoURL: data.result.photo,
                        email: data.result.email
                    });
                });


        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleRepeatNewPasswordChange = this.handleRepeatNewPasswordChange.bind(this);
        this.handlePhotoURLChange = this.handlePhotoURLChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (event) {

/*        fetch("http://127.0.0.1:5000/getToken",
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
                    this.props.logIn(data.token);
                    this.props.endLogIn();
                } else {
                    this.setState({warning: 'Login or password is not correct'});
                }
            });
*/
        this.props.endEditProfile();
        event.preventDefault();
    }

    handleEmailChange (event) {
        this.setState({email:event.target.value})
    }

    handleNewPasswordChange (event) {
        this.setState({newPassword:event.target.value})
    }

    handleRepeatNewPasswordChange (event) {
        this.setState({repeatNewPassword:event.target.value})
    }


    handlePhotoURLChange (event) {
        this.setState({photoURL:event.target.value})
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
                <div className="dark-background" onClick={this.props.endEditProfile}/>

                <form className="edit-form" onSubmit={this.handleSubmit}>
                    Login:
                    <br/>
                    <input
                        type="text"
                        placeholder={this.state.login}
                        value={this.state.login}
                        onChange={this.handleLoginChange}
                    />
                    E-mail:
                    <br/>
                    <input
                        type="email"
                        placeholder="e-mail"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                    />
                    URL of the photo:
                    <br/>
                    <input
                        type="url"
                        placeholder="http//photo.com"
                        value={this.state.photoURL}
                        onChange={this.handlePhotoURLChange}
                    />
                    Password:
                    <br/>
                    <input
                        type="password"
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                    />
                    New password:
                    <br/>
                    <input
                        type="password"
                        placeholder="New password"
                        value={this.state.newPassword}
                        onChange={this.handleNewPasswordChange}
                    />
                    Repeat new password:
                    <input
                        type="password"
                        placeholder="Repeat new password"
                        value={this.state.repeatNewPassword}
                        onChange={this.handleRepeatNewPasswordChange}
                    />

                    <button onClick={this.handleSubmit} className="submit-button">CHANGE</button>
                    {this.state.warning !== '' ? (<div className="error-message">{this.state.warning}</div>) : null}
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
        endEditProfile: () => {
            dispatch(endEditProfile());
        },
        logIn: token => {
            dispatch(logIn(token));
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(EditProfileForm)

