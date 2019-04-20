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
            films: []
        }
    }

    componentDidMount() {
        fetch('http://127.0.0.1:5000/get_films')
            .then(response => response.json())
            .then(data => {
                this.setState({films:data})
            })
    }

    render() {

        const {films} = this.state;
        const postPerPage = 6;



        const posters = films.map((film, i) =>
            <Poster alt={i + " slide"} filmInfo = {film}></Poster>
        )

        let slides = []

        for (let i = 0; i < posters.length;) {
            let temp = [];

            for (let j = 0; j < postPerPage; j++) {
                temp.push(posters[(i + j) % posters.length])
            }

            slides.push(
                <Carousel.Item>
                    <div className="d-flex">
                        <div className="Posters">
                            {temp}
                        </div>
                    </div>

                </Carousel.Item>)

            i += postPerPage
            if (i >= posters.length)
                i -= posters.length
            if (i === 0)
                break
        }

        return(
            <div>
                <Carousel indicators={false} interval={20000}>
                    {slides}
                </Carousel>
            </div>
        )
    }


}