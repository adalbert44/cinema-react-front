import React, {PureComponent} from 'react'
import './StyleAddPostForm.css'
import {connect} from "react-redux";
import {endAddPost} from "../../actions/todoActions";

class AddPostForm extends PureComponent {
    constructor (props){
        super(props);

        this.state = {
            title: '',
            body: '',
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit (event) {

        fetch("http://127.0.0.1:5000/add_post/" + this.props.ID,
            {  method: "POST",
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    'body': this.state.body,
                    'header': this.state.title
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.props.endAddPost();
            });

        event.preventDefault();
    }

    handleTitleChange (event) {
        this.setState({title:event.target.value})
    }

    handleBodyChange (event) {
        this.setState({body:event.target.value})
    }

    render() {
        return(
            <div className="modal-window">
                <div className="dark-background" onClick={this.props.endAddPost}/>

                <form className="add-post-form" onSubmit={this.handleSubmit}>
                    Title:
                    <br/>
                    <input
                        type="text"
                        placeholder="title"
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                    />
                    Body:
                    <br/>
                    <textarea
                        rows="10"
                        className="post-body"
                        placeholder="body"
                        value={this.state.body}
                        onChange={this.handleBodyChange}
                    />
                    <button onClick={this.handleSubmit} className="submit-button">SUBMIT</button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isAuthorized: state.authorization.isAuthorized
    }
}

function mapDispatchProps(dispatch) {
    return {
        endAddPost: () => {
            dispatch(endAddPost());
        }
     }
}

export default connect(mapStateToProps, mapDispatchProps)(AddPostForm)

