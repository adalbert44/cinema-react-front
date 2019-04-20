import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import MainMenu from './MainMenu'
import FilmSlider from "./FilmSlider/FilmSlider";

class App extends Component {
    render() {
        return (
            <div>
                <MainMenu/>
                <FilmSlider/>
            </div>
                )
    }
}

export default App
