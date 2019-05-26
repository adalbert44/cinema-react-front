import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import YouTube from "react-youtube";
import './StyleInfoFilm.css'
import '../SessionsTable/SessionTable'
import SessionTable from "../SessionsTable/SessionTable";

export default class InfoFilm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            comments: [{}],
            description: '',
            sessions: [{}],
            title: '',
            url_picture: '',
            url_trailer: '',
            openedSession: [{}]
        }
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/get_film/' + this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                const filmInfo = data;
                const comments = Object.assign({}, data.result.comments);
                const sessions = Object.assign({}, data.result.sessions);
                if (filmInfo !== undefined){
                    this.setState({
                        comments: comments,
                        description: filmInfo.result.description,
                        sessions: sessions,
                        title: filmInfo.result.title,
                        url_picture: filmInfo.result.url_picture,
                        url_trailer: filmInfo.result.url_trailer,

                    })

                }

            });

    }

    unique = (arr) => {
        let obj = {};

        for (let i = 0; i < arr.length; i++) {
            let str = arr[i];
            obj[str] = true;
        }

        return Object.keys(obj);
    }

    setInfoInTable = (day, sessions) => {
        this.setState({openedSession: Object.values(sessions).map((session) => {
            if (day == session.date)
                return session;
        })
    })
    }

    render() {
        const sessions = this.state.sessions;
        let days = Object.values(sessions).map(session => {
            if (session.date != undefined)
                return {'num': +(session.date.substr(0,2)),
                        'str': session.date};
            else
                return '';
        });
        days = days.sort((a,b) => ((+a.num)-(+b.num)));
        days = this.unique(days.map((i) => i.str));
        let buttonsDay = days.map(day => {
            return <button className="btn btn-warning" onMouseEnter={() => this.setInfoInTable(day,sessions)}>{day}</button>
        })
        return (
            <div>
                <h2>{this.state.title}</h2>

                <img
                    className='Poster'
                    src={this.state.url_picture}
                    alt="img">
                </img>
                <p>Description:{this.state.description}</p>
                <YouTube
                videoId={this.state.url_trailer}
                />
                <p>{this.state.sessions.date}</p>
                {buttonsDay}
                <SessionTable sessions = {this.state.openedSession}/>
            </div>
        )


    }

}