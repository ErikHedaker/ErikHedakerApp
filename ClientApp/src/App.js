import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Portfolio } from './components/Portfolio';
import { Projects } from './components/Projects';
import { TicTacToe } from './components/TicTacToe';
import { Snake } from './components/Snake/Snake';
import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/Portfolio' component={Portfolio} />
                <Route path='/Projects' component={Projects} />
                <Route path='/TicTacToe' component={TicTacToe} />
                <Route path='/Snake/Snake/' component={Snake} />
            </Layout>
        );
    }
}