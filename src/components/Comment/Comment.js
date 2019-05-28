import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './StyleComment.css'


export default class Comment extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let avatar = this.props.comment.url_photo_author;
        return (
            <div className="Comment">
                <img
                    className="Avatar"
                    src={avatar}
                />
                <div className="Nickname">{this.props.comment.author_username}</div>
                <p className="Date">{this.props.comment.timestamp}</p>
                <p className="Rating">{this.props.comment.header}</p>
                <p className="CommentText">{this.props.comment.body}</p>
            </div>
        )
    }
}