import React, { Component } from 'react';
import './Dungeoncrawler.css';

export class Dungeoncrawler extends Component {
    static displayName = Dungeoncrawler.name;

    constructor(props) {
        super(props);
        this.state = {
            view: [],
            input: "",
            loading: true
        };
    }

    componentDidMount() {
        //this.GetDungeoncrawler();
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading, please wait.</em></p>
            : this.RenderView( );

        return (
            <div style={{ textAlign: 'center' }}>
                {contents}
            </div>
        );
    }

    RenderView() {
        let Paragraphs = strings => {
            return strings.map( ( line, index ) => {
                return (
                    <p key={index}>
                        {line}
                    </p>
                )
            });
        }

        return (
            <div className="box output">
                {Paragraphs(this.state.view.output)}
            </div>
        );
    }

    async GetDungeoncrawler() {
        const response = await fetch('api/Dungeoncrawler');
        const data = await response.json();
        console.log(JSON.stringify(data));
        this.setState({ view: data, loading: false });
    }
}
