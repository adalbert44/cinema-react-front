import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import Comment from '../Comment/Comment'
import './StyleCommentsField.css'
import {endAddPost} from "../../actions/todoActions";
import {connect} from "react-redux";


class CommentsField extends Component {
    constructor(props) {
        super(props);

        this.state ={
            comment: "",
            curUserID: -1
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                this.setState({curUserID:curUserID.ID});
            })
    }

    componentWillReceiveProps(nextProps) {

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
                this.setState({curUserID:curUserID.ID});
            })
    }



    handleSubmit (event) {

        fetch("http://127.0.0.1:5000/add_comment/" + this.props.ID,
            {  method: "POST",
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    'body': this.state.comment,
                    'header': "",
                    'author_id': this.state.curUserID
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({
                    comment: ""
                });
                this.props.update();
            });

        event.preventDefault();
    }

    handleCommentChange (event) {
        this.setState({comment:event.target.value})
    }



    render() {
    const comments = Object.values(this.props.comments).map((comment) => {
        return <Comment comment={comment}/>
    });

    let addCom;
    if (this.state.curUserID !== -1)
        addCom=
        <div className="add-comment">
            <div className="AddCommentText">Add comment:</div>
            <textarea
                rows="4"
                className="comment"
                placeholder="comment"
                value={this.state.comment}
                onChange={this.handleCommentChange}
            />
            <button className="btn badge-warning AddCommentButton" onClick={this.handleSubmit}>Add</button>
        </div>;

        return (
            <div className="CommentsField">
                {comments}
                {addCom}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuthorized: state.authorization.isAuthorized
    }
}

export default connect(mapStateToProps)(CommentsField)

