import React from 'react'
import './Prices.css'

class Prices extends React.Component {
    state = {
        response: {},
        haveResponse: false
    }

    componentDidMount = () => {
        this.fetchPrices();
    }

    fetchPrices = () => {
        const { page } = this.props.match.params

        var headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }

        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        fetch('http://127.0.0.1:8000/passenger-type/', requestOptions)
            .then(res => res.json())
            .then(json => {this.setState({
                response: json,
                haveResponse: true,
            })});


    }

    render() {
        return (
            <div className='center'>
                <h1>Ceny a lístky</h1>
                {this.state.haveResponse ? this.state.response.results.map((p, i) => {
                    return (
                        <div key={p.short}>
                            <h2>{p.name}</h2>
                            <p>Cena rezervácie je {p.reservation_price} €.</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Vzdialenosť do</th>
                                        <th>Prvá trieda</th>
                                        <th>Druhá trieda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {p.pricing.map((pricing, i) => {
                                        return (
                                            <tr key={p.short + i}>
                                                <td>{pricing.max_distance ? pricing.max_distance + ' km' : 'Viac'}</td>
                                                <td>{pricing.first_class_price_per_km} €/km </td>
                                                <td>{pricing.second_class_price_per_km} €/km </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                }) : 'Načítavam...'}
            </div>
        )
    }
}
export default Prices