import React, {Component} from 'react'
import "./StyleInfoField.css"
import {connect} from "react-redux";
import editTex from "./textures/edit_tex.png";
import {startEditProfile} from '../../actions/todoActions'


class InfoField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            photoURL: "",
            canBeEdited: false
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
                console.log(data);
                this.setState({
                    name: data.result.username,
                    photoURL: data.result.photo
                });
            })

        if(this.props.isAuthorized) {
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
                    this.setState({canBeEdited:curUserID.ID == this.props.ID});
                })
        }
    }

    componentWillReceiveProps(nextProps) {

        fetch("http://127.0.0.1:5000/get_user/" + nextProps.ID,
            {
                method: "POST",
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    name: data.result.username,
                    photoURL: data.result.photo
                });
            });

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
                    this.setState({canBeEdited:curUserID.ID == this.props.ID});
                })
        }
    }

    render() {
        return (
            <div className="info-fieldd">
                <img className="profile-photo" src={this.state.photoURL} alt=""/>
                {this.state.canBeEdited ? (
                    <div className="edit-button" onClick={this.props.startEditProfile}> <img alt="tutu" src={editTex}/></div>
                ) : (
                    <div/>
                )
                }
                <div className="name">{this.state.name}</div>

            </div>
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
        startEditProfile: () => {
            dispatch(startEditProfile());
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(InfoField)