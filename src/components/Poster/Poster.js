import React, {PureComponent} from 'react'
import {Carousel, Container, Col, Row, Media, Image} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import './StylePost.css'

export default class Poster extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            isMouseOnImg:false
        }
    }

    render() {
        const {filmInfo} = this.props;
        const describingBody = this.state.isMouseOnImg ?
            <div className="ContentOnImg">
                <span className="NameOfFilm fadeInUp">**тут надо посчитать символы и поставить... на что надо**</span>
                <span className="DescribingText fadeInUp">***Описание фильма Привет  как дела   как погода аззазаа   мне нравятся ноги   твои и глаза Тут надо определить максимальное количество символов и где они заступают на кнопочку поменять на ...***</span>
                <button className="DescribingBtn fadeInUp">Подробнее о фильме</button>
            </div> : <span/>;


        return(
            <div
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseLeave}
                id="Poster"
            >
                {describingBody}
                <img
                    src={filmInfo.url_picture}
                    alt="img">
                </img>

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





