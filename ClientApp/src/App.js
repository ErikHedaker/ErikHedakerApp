import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { CurriculumVitae } from './components/CurriculumVitae';
import { Portfolio } from './components/Portfolio';
import { Snake } from './components/Snake';
import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home}/>
                <Route path='/CurriculumVitae' component={CurriculumVitae}/>
                <Route path='/Portfolio' component={Portfolio}/>
                <Route path='/Snake' component={Snake}/>
            </Layout>
        );
    }
}