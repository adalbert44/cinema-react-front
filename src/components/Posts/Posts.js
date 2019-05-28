import React, {Component} from 'react'
import './StylePosts.css'
import plus from "./textures/plus.png"
import {startAddPost} from "../../actions/todoActions";
import {connect} from "react-redux";
import Post from '../Post/Post'

class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
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
                    this.setState({canBeEdited:curUserID.ID == this.props.ID});
                })
        } else
            this.setState({canBeEdited: 0});
    }


    render() {
        console.log(this.state.posts);
        let htmlPosts = [];

        for (let i = this.state.posts.length -  1; i >= 0; i--) {
            htmlPosts.push(<Post info={this.state.posts[i]}/>)
        }

        return (
            <div className="posts-field">
                {this.state.canBeEdited && <div className="plus-button" onClick={this.props.startAddPost}> <img alt="tutu" src={plus}/></div>}
                <div className="postss">
                    {htmlPosts}
                </div>
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
        startAddPost: () => {
            dispatch(startAddPost());
        }
    }
}

export default connect(mapStateToProps, mapDispatchProps)(Posts)
