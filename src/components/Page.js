import React from 'react'

class Page extends React.Component {
    state = {
        response: {}
    }

    componentDidMount = () => {
        this.fetchArticle();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.fetchArticle();
    }

    fetchArticle = () => {
        const { page } = this.props.match.params

        var headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }

        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        fetch('http://127.0.0.1:8000/article/'+page, requestOptions)
            .then(res => res.json())
            .then(json => {this.setState({
                response: json,
                haveResponse: true,
            })});
    }

    render() {
        return (
            <div className='center'>
                <h1>{this.state.response.name}</h1>
                <div dangerouslySetInnerHTML={{__html: this.state.response.html}}/>
            </div>
        )
    }
}
export default Page