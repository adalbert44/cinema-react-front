import React, {Component} from 'react'
import InfoField from "../InfoField/InfoField";
import Posts from "../Posts/Posts";
import "./StyleUserPage.css"
import {connect} from "react-redux";
import EditProfileForm from "../EditProfileForm/EditProfileForm"


class UserPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        
        return (
            <div className="full-screen">
                <div className="info-field">
                    <InfoField ID={this.props.match.params.id}/>
                </div>
                <div className="posts">
                    <Posts/>
                </div>
                {this.props.editingStarted && <EditProfileForm ID={this.props.match.params.id}/>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        editingStarted: state.editProfileWindow.editingStarted,
    }
}

export default connect(mapStateToProps)(UserPage)