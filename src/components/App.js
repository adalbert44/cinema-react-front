import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import MainMenu from './MainMenu'
import FilmSlider from "./FilmSlider";
import films from '../films'

class App extends Component {
    render() {
        return (
            <div>
                <MainMenu/>
                <FilmSlider images = {films}/>
            </div>
                )
    }
}

export default App
