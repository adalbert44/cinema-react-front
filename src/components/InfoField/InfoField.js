import React, {Component} from 'react'
import "./StyleInfoField.css"
import {connect} from "react-redux";
import editTex from "./textures/edit_tex.png";
import {startEditProfile} from '../../actions/todoActions'


class InfoField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            photoURL: this.props.photoURL,
            canBeEdited: this.props.canBeEdited
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.name,
            photoURL: nextProps.photoURL,
            canBeEdited: nextProps.canBeEdited
        })
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
