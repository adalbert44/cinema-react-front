import React, {Component} from 'react'
import InfoField from "../InfoField/InfoField";
import Posts from "../Posts/Posts";
import "./StyleUserPage.css"
import {connect} from "react-redux";
import EditProfileForm from "../EditProfileForm/EditProfileForm"
import AddPostForm from "../AddPostForm/AddPostForm";


class UserPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            photoURL: "",
            canBeEdited: false,
            posts: []
        };

        this.update();
    }

    update() {
        fetch("http://127.0.0.1:5000/get_user/" + this.props.match.params.id,
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
                    photoURL: data.result.photo,
                    posts: data.result.posts
                });
            });

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
                    this.setState({canBeEdited:curUserID.ID == this.props.match.params.id});
                })
        }
    }

    componentWillReceiveProps(nextProps) {

        fetch("http://127.0.0.1:5000/get_user/" + nextProps.match.params.id,
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
                    photoURL: data.result.photo,
                    posts: data.result.posts
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
                    this.setState({canBeEdited:curUserID.ID == nextProps.match.params.id});
                })
        } else
            this.setState({canBeEdited: 0});
    }


    render() {

        return (
            <div className="full-screen">
                <div className="info-field">
                    <InfoField name={this.state.name} photoURL={this.state.photoURL} canBeEdited={this.state.canBeEdited} ID={this.props.match.params.id}/>
                </div>
                <div className="posts">
                    <Posts posts={this.state.posts} canBeEdited={this.state.canBeEdited} ID={this.props.match.params.id}/>
                </div>
                {this.props.editingStarted && <EditProfileForm ID={this.props.match.params.id}/>}
                {this.props.addingPostStarted && <AddPostForm ID={this.props.match.params.id}/>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        editingStarted: state.editProfileWindow.editingStarted,
        addingPostStarted: state.addPostWindow.addingPostStarted,
        isAuthorized: state.authorization.isAuthorized
    }
}

export default connect(mapStateToProps)(UserPage)