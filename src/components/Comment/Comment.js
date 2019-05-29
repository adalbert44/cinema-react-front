import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './StyleComment.css'
import {Link} from "react-router-dom";


export default class Comment extends Component {

    render() {
        let time = this.props.comment.timestamp;
        if (time)
            time = time.substr(0, 19);
        let avatar = this.props.comment.url_photo_author;
        return (
            <div className="Comment">
                <Link to={`/cinema/user/${this.props.comment.author_id}`}>
                <img
                    className="Avatar"
                    src={avatar}
                    alt=""

                />
                </Link>
                <div className="Nickname">{this.props.comment.author_username}</div>
                <p className="Date">{time}</p>
                <p className="CommentText">{this.props.comment.body}</p>
            </div>
        )
    }
}