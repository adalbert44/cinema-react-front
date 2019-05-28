import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import Comment from '../Comment/Comment'
import './StyleCommentsField.css'


export default class CommentsField extends Component {
    constructor(props) {
        super(props);
    }



    render() {
    const comments = Object.values(this.props.comments).map((comment) => {
        return <Comment comment={comment}/>
    })

        return (
            <div className="CommentsField">
                {comments}
                <div className="AddCommentText">Add comment:</div>
                <input type="text"/>
                <button className="btn badge-warning AddCommentButton">Add</button>

            </div>
        )
    }
}