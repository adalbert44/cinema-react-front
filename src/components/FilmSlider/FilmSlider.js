import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import Poster from '../Poster/Poster'
import './StyleFilmSlider.css'


export default class FilmSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slides: [],
            posters: [],
            width: window.innerWidth,
            numberSlide: 0
        }
    }

    getSlides = (posters) => {
        const postPerPage = Math.max(parseInt((this.state.width - 150) / 400, 10), 1);

        let slides = [];

        for (let i = 0; i < posters.length;) {
            let temp = [];

            for (let j = 0; j < postPerPage; j++) {
                temp.push(posters[(i + j) % posters.length])
            }

            slides.push(
                <div className="Posters">
                    {temp}
                </div>);

            i += postPerPage;
            if (i >= posters.length)
                i -= posters.length;
            if (i === 0)
                break
        }

        return slides;
    };

    componentDidMount() {
        fetch('http://127.0.0.1:5000/get_films')
            .then(response => response.json())
            .then(data => {
                const films = data;

                let posters = [];
                if (films !== undefined) {
                    for (let i = 0; i < films.length; i++) {
                        posters.push(<Poster alt={i + " slide"} filmInfo = {films[i]}/>);
                    }
                }

                this.setState({slides:this.getSlides(posters),
                                     posters: posters})
            });
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize() {
        this.setState({width: window.innerWidth});
        this.setState({slides:this.getSlides(this.state.posters)});
    }

    render() {

        const postPerPage = Math.max(parseInt((this.state.width - 150) / 400, 10), 1);

        return(
            <div className="slider">
                <button className="arrow" onClick={this.prevSlide} style={{width: parseInt((this.state.width - postPerPage*400) / 2)}}>left</button>
                <div>
                    {this.state.slides[this.state.numberSlide]}
                </div>
                <button className="arrow" onClick={this.nextSlide} style={{width: parseInt((this.state.width - postPerPage*400) / 2)}}>right</button>
            </div>
        )
    }

    prevSlide = () => {
        if (this.state.numberSlide >= 1){
            this.setState({numberSlide: this.state.numberSlide - 1})
        } else {
            this.setState({numberSlide: this.state.slides.length - 1})
        }
    };

    nextSlide = () => {
        if (this.state.numberSlide < this.state.slides.length - 1){
            this.setState({numberSlide: (this.state.numberSlide + 1)})
        } else {
            this.setState({numberSlide: 0})
        }
    }

}