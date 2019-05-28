import React, {Component} from 'react'
import "./StylePost.css"
import deleteTex from "./textures/delete.png"
import {startAddPost} from "../../actions/todoActions";
import {connect} from "react-redux";

class Post extends Component {
    constructor(props) {
        super(props);


        this.delete = this.delete.bind(this);
    }

    delete() {
        fetch("http://127.0.0.1:5000/del_post",
            {
                method: "POST",
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                body: JSON.stringify({
                    "user_id": this.props.ID,
                    "post_id": this.props.info.id
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.props.update();
            });
    }

    render() {

        let del;
        if (this.props.isAuthorized) {
            del = <img className="delete-button" src={deleteTex} alt="tutu" onClick={this.delete}/>;
        }

        return (
            <div>
                <div className="header">
                    {del}
                    <div className="header-text">
                        {this.props.info.header}
                    </div>
                </div>
                <div className="body">
                    {this.props.info.body}
                    <br/>
                    <div className="time">
                        {this.props.info.timestamp.slice(0, 19)}
                    </div>
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

export default connect(mapStateToProps)(Post)
