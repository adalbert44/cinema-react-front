import React, {Component} from 'react'
import InfoField from "../InfoField/InfoField";
import Posts from "../Posts/Posts";
import "./StyleUserPage.css"


export default class UserPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }


    }

    render() {

        return (
            <div className="full-screen">
                <div className="info-field">
                    <InfoField ID={this.props.match.params.id}/>
                </div>
                <div className="posts">
                    <Posts/>
                </div>
            </div>
        )
    }
}