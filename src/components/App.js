import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import MainMenu from './MainMenu'
import FilmSlider from "./FilmSlider/FilmSlider";
import "./StyleApp.css"

class App extends Component {
    render() {
        return (
            <div className="merger">
                <div id = "menuField">
                    <MainMenu/>
                </div>
                <div id = "sliderField">
                    <FilmSlider/>
                </div>

            </div>
        )
    }
}

export default App