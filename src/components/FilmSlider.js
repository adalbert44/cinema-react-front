import React, {Component} from 'react'
import {Carousel} from 'react-bootstrap'
import films from "../films";

export default class FilmSlider extends Component {
    render() {
        const {images} = this.props;

        const slides = images.map((image, i) =>
            <Carousel.Item>
                <img className="d-block w-100" src={image.img} alt={i + " slide"}/>
            </Carousel.Item>
        )
        return(
            <div>
                <Carousel>
                    {slides}
                </Carousel>
            </div>
        )

    }
}





