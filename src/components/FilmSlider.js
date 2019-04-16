import React, {Component} from 'react'
import {Carousel, Container, Col, Row, Media, Image} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import films from "../films";

export default class FilmSlider extends Component {
    render() {
        const {images} = this.props;
        const postPerPage = 6;

        const posters = images.map((image, i) =>
            <div className="col col-xs-2 col-sm-2 col-md-2 col-lg-2">
                <img src={image.img} alt={i + " slide"}/>
            </div>
        )

        let slides = []

        for (let i = 0; i < posters.length;) {
            let temp = [];

            for (let j = 0; j < postPerPage; j++) {
                temp.push(posters[(i + j) % posters.length])
            }

            slides.push(
            <Carousel.Item>
                <div className="container-fluid">

                    <div className="row">
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





