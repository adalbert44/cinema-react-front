import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'


export default class InfoFilm extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const {filmInfo} = this.props;

        return (
            <div id = "modalWindow">
                <div id = "background"/>
                <div id = "info">
                    <h3> {filmInfo.name} </h3>
                    <img src={filmInfo.img}/>
                    <article> {filmInfo.description} </article>
                </div>
            </div>
        )


    }

}