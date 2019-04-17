import React, {PureComponent} from 'react'
import {Carousel, Container, Col, Row, Media, Image} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './StylePost.css'


export default class Poster extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isMouseOnImg: false
        }
    }

    render() {
        const {filmInfo} = this.props;



        return(
            <div className="col col-xs-12 col-sm-6 col-md-4 col-lg-2 my-auto">
                <img
                    src={filmInfo.img}
                    onMouseEnter={this.mouseEnter}
                    onMouseLeave={this.mouseLeave}
                    alt="img">
                </img>
                {this.state.isMouseOnImg ?<p className="fadeInUp" >OPISANIE FILMA</p> : <div/>}


            </div>
        )
    }

    mouseLeave = () => {
        this.setState({
            isMouseOnImg: false
        })
    }

    mouseEnter = () =>{
        this.setState({
            isMouseOnImg: true
        })
    }


}





