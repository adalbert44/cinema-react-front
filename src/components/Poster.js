import React, {PureComponent} from 'react'
import {Carousel, Container, Col, Row, Media, Image} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'


export default class Poster extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isMouseOver: false
        }
    }

    render() {
        const {filmInfo} = this.props;



        return(
            <div className="col col-xs-12 col-sm-6 col-md-4 col-lg-2 my-auto">
                {!this.state.isMouseOver ? (<img src={filmInfo.img} alt="img"/>) : (<div>tutu</div>)}
            </div>
        )
    }

    mouseOver = () => {
        this.setState({
            isMouseOver: true
        })
    }

    mouseOut = () => {
        this.setState({
            isMouseOver: false
        })
    }
}





