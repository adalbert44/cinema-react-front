import React, {Component} from 'react'
import {Carousel, Container, Col, Row, Media} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import films from "../films";

export default class FilmSlider extends Component {
    render() {
        const {images} = this.props;

        const slides = images.map((image, i) =>
            <Carousel.Item>
                <Media>
                    <img
                        width={900}
                        height={900}
                        className="mr-3"
                        src={image.img}
                        alt={i + " slide"}
                    />
                    <Media.Body>
                        <h5>Media Heading</h5>
                        <p>
                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                            ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                            tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
                            Donec lacinia congue felis in faucibus.
                        </p>
                    </Media.Body>
                </Media>;

                <Container>
                    <Row>
                        <Col>
                            <Media>
                                <img className="d-block w-100 col-xs-12 col-sm-9 col-md-4 col-lg-6" src={image.img} alt={i + " slide"}/>
                            </Media>
                        </Col>
                        <Col>
                            tuturu!
                        </Col>
                    </Row>
                </Container>
            </Carousel.Item>
        )
        return(
            <div>
                <Carousel indicators={false}>
                    {slides}
                </Carousel>
            </div>
        )

    }
}





