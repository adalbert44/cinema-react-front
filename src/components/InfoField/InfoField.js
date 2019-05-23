import React, {Component} from 'react'
import "./StyleInfoField.css"


export default class InfoField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            photoURL: "",
            info: ""
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
                this.setState({
                    name: data.username,
                    photoURL: data.photo
                });
            })
    }

    render() {

        return (
            <div className="info-fieldd">
                <img src={this.state.photoURL} alt=""/>
            </div>
        )
    }
}