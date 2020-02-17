import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Snake } from './components/Snake';
import { AboutMe } from './components/AboutMe';
import './custom.css';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home}/>
                <Route path='/Snake' component={Snake}/>
                <Route path='/AboutMe' component={AboutMe}/>
            </Layout>
        );
    }
}