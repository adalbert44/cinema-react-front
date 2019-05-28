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
            posts: this.props.posts,
            canBeEdited: this.props.canBeEdited
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            posts: nextProps.posts,
            canBeEdited: nextProps.canBeEdited
        })
    }


    render() {
        let htmlPosts = [];

        for (let i = this.state.posts.length -  1; i >= 0; i--) {
            htmlPosts.push(<Post info={this.state.posts[i]} update={this.props.update} ID={this.props.ID} canBeEdited={this.state.canBeEdited}/>)
        }
        let edit;
        if (this.state.canBeEdited)
            edit = <div className="plus-button" onClick={this.props.startAddPost}> <img alt="tutu" src={plus}/></div>;
        return (

            <div className="posts-field">
                {edit}
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
