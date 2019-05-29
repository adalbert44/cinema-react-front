import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import YouTube from "react-youtube";
import './StyleInfoFilm.css'
import '../SessionsTable/SessionTable'
import SessionTable from "../SessionsTable/SessionTable";
import CommentsField from '../CommentsField/CommentsField'

export default class InfoFilm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [{}],
            description: '',
            sessions: [{}],
            title: '',
            url_picture: '',
            url_trailer: '',
            openedSession: [{}],
        }
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/get_film/' + this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                const filmInfo = data;
                const comments = Object.assign({}, data.result.comments);
                const sessions = Object.assign({}, data.result.sessions);
                console.log(data);
                if (filmInfo !== undefined){
                    this.setState({
                        comments: comments,
                        description: filmInfo.result.description,
                        sessions: sessions,
                        title: filmInfo.result.title,
                        url_picture: filmInfo.result.url_picture,
                        url_trailer: filmInfo.result.url_trailer,
                        chosenDay: 0
                    })

                }

                let days = Object.values(sessions);
                days = days.sort((a,b) => ((+a.date.substr(0,2))-(+b.date.substr(0,2))));
                days = this.unique(days.map((i) => i.date));

                this.setInfoInTable(days[0], sessions);
            });
    }

    update() {
        fetch('http://127.0.0.1:5000/get_film/' + this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                const filmInfo = data;
                const comments = Object.assign({}, data.result.comments);
                const sessions = Object.assign({}, data.result.sessions);
                console.log(data);
                if (filmInfo !== undefined){
                    this.setState({
                        comments: comments,
                        description: filmInfo.result.description,
                        sessions: sessions,
                        title: filmInfo.result.title,
                        url_picture: filmInfo.result.url_picture,
                        url_trailer: filmInfo.result.url_trailer,
                        chosenDay: 0
                    })

                }

                let days = Object.values(sessions);
                days = days.sort((a,b) => ((+a.date.substr(0,2))-(+b.date.substr(0,2))));
                days = this.unique(days.map((i) => i.date));

                this.setInfoInTable(days[0], sessions);
            });
    }

    unique = (arr) => {
        let obj = {};

        for (let i = 0; i < arr.length; i++) {
            let str = arr[i];
            obj[str] = true;
        }

        return Object.keys(obj);
    };

    setInfoInTable = (day, sessions) => {
        const openSession = Object.values(sessions).map((session) => {
            if (day == session.date)
                return session;
        }).sort((a,b) => {
            if (a.time.substr(0,2) == b.time.substr(0,2)){
                return a.time.substr(3,2) - b.time.substr(3,2);
            } else {
                return a.time.substr(0,2) - b.time.substr(0,2);
            }
        });
        this.setState({openedSession: openSession,
                             chosenDay: day})
    };

    render() {
        const sessions = this.state.sessions;
        let days = Object.values(sessions);
        days = days.sort((a,b) => ((+a.date.substr(0,2))-(+b.date.substr(0,2))));
        days = this.unique(days.map((i) => i.date));
        let width = 100.0/days.length;
        let buttonsDay = days.map(day => {
            if (day === this.state.chosenDay) {
                return <button className="btn btn-warning ChooseDate" style={{width:width + "%", backgroundColor: "#FF7C22"}} onClick={() => this.setInfoInTable(day,sessions)}>{day}</button>
            } else {
                return <button className="btn btn-warning ChooseDate" style={{width:width + "%"}} onClick={() => this.setInfoInTable(day,sessions)}>{day}</button>
            }
        });

        return (
            <div className="InfoFilm">
                <div className="block-left">
                    <img
                        className='PosterInInfo'
                        src={this.state.url_picture}
                        alt="img">
                    </img>
                    <h2>{this.state.title}</h2>
                    <p id="Description">{this.state.description}</p>
                </div>
                <div className="block-right">
                    <YouTube className="trailer"
                    videoId={this.state.url_trailer}
                    />
                    <div className="btn-group" style={{width: 100 + "%"}}>
                    {buttonsDay}
                    </div>
                    <SessionTable sessions = {this.state.openedSession}/>
                    <CommentsField comments={this.state.comments} update={this.update.bind(this)} ID={this.props.match.params.id}/>
                </div>
            </div>
        )

    }

}