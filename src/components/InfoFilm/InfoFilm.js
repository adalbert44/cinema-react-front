import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'

export default class InfoFilm extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const filmInfo = parseInt(this.props.match.params.id, 10);

        return (
            <div>
                <span>Here film with id: {filmInfo}</span>
            </div>
        )


    }

}