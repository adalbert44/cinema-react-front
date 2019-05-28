import React, {Component} from 'react'
import "./StylePost.css"
import deleteTex from "./textures/delete.png"

export default class Post extends Component {
    render() {

        return (
            <div>
                <div className="header">
                    <img className="delete-button" src={deleteTex} alt="tutu"/>
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