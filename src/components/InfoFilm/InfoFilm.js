import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import YouTube from "react-youtube";
import './StyleInfoFilm.css'

export default class InfoFilm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            comments: [{}],
            description: '',
            sessions: [{}],
            title: '',
            url_picture: '',
            url_trailer: ''
        }
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/get_film/' + this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                const filmInfo = data;
                const comments = Object.assign({}, data.result.comments);
                const sessions = Object.assign({}, data.result.sessions);
                if (filmInfo !== undefined && filmInfo.status!='ERROR'){
                    this.setState({
                        comments: comments,
                        description: filmInfo.result.description,
                        sessions: sessions,
                        title: filmInfo.result.title,
                        url_picture: filmInfo.result.url_picture,
                        url_trailer: filmInfo.result.url_trailer
                    })

                }

            });

    }

    render() {
        console.log(this.state.url_trailer)
        return (
            <div>
                <h2>{this.state.title}</h2>

                <img
                    className='Poster'
                    src={this.state.url_picture}
                    alt="img">
                </img>
                <p>Description:{this.state.description}</p>

            </div>
        )


    }

}