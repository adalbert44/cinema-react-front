import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './StyleSessionTable.css'


export default class SessionTable extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        const rows = [];
        if (Object.values(this.props.sessions).length!=0)
        Object.values(this.props.sessions).forEach(session => {
            if (session != undefined)
            rows.push(
                <tr>
                    <td>{session.time}</td>
                    <td>{session.price}</td>
                    <td>{session.title_cinema}</td>
                    <td>{session.location}</td>
                </tr>
            )
        });
        let Table = (
            <div>
                <table className="table">
                    <tr>
                        <td>Time</td>
                        <td>Price</td>
                        <td>Cinema</td>
                        <td>Adress</td>
                    </tr>
                    {rows}
                </table>
            </div>
        );
        if (rows.length == 1) Table ='';
        return (
            <div>
                {Table}
            </div>
        )

    }

}