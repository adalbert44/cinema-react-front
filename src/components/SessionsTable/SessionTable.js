import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './StyleSessionTable.css'


export default class SessionTable extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        const rows = [];
        console.log(this.props.sessions,'-----')
        if (Object.values(this.props.sessions).length!=0)
        Object.values(this.props.sessions).forEach(session => {
            if (session != undefined)
            rows.push(
                <tr>
                    <td>{session.time}</td>
                    <td>{session.title_cinema}</td>
                    <td>{session.location}</td>
                </tr>
            )
        });
        return (
            <div>
                <table>
                    <tr>
                        <td>Time</td>
                        <td>Cinema</td>
                        <td>Adress</td>
                    </tr>
                    {rows}
                </table>
            </div>
        )

    }

}