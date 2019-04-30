import React, {Component} from 'react'
import {Carousel, Container, Col, Row, Media, Image} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import films from "../../films";
import Poster from '../Poster/Poster'
import './StyleFilmSlider.css'


export default class FilmSlider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            films: [],
            width: window.innerWidth
        }
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/get_films')
            .then(response => response.json())
            .then(data => {
                this.setState({films:data})
            })
            window.addEventListener("resize", this.resize.bind(this));
            this.resize();
    }

    resize() {
        this.setState({width: window.innerWidth});
    }

    render() {

        const films = this.state.films;
        const postPerPage = Math.max(parseInt((this.state.width - 150) / 400, 10), 1)
        console.log((this.state.width - 150) / 400)

        let posters = [];
        if (films !== undefined) {
            for (let i = 0; i < films.length; i++) {
                posters.push(<Poster alt={i + " slide"} filmInfo = {films[i]}></Poster>);
            }
        }


        let slides = [];

        for (let i = 0; i < posters.length;) {
            let temp = [];

            for (let j = 0; j < postPerPage; j++) {
                temp.push(posters[(i + j) % posters.length])
            }

            slides.push(
                        <div className="Posters">
                            {temp}
                        </div>)

            i += postPerPage
            if (i >= posters.length)
                i -= posters.length
            if (i === 0)
                break
        }

        return(
            <div className="slider">
                <button className="arrow" style={{width: parseInt((this.state.width - postPerPage*400) / 2)}}>left</button>
                {slides[0]}
                <button className="arrow" style={{width: parseInt((this.state.width - postPerPage*400) / 2)}}>right</button>
            </div>
        )
    }


}