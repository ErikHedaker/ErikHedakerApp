import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AboutMe } from './components/AboutMe';
import { Overview } from './components/Overview';
import { Dungeoncrawler } from './components/Dungeoncrawler';
import { Snake } from './components/Snake';

export default function App(props) {
    return (
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/AboutMe' component={AboutMe} />
            <Route path='/Overview' component={Overview} />
            <Route path='/Dungeoncrawler' component={Dungeoncrawler} />
            <Route path='/Snake' component={Snake} />
        </Layout>
    );
}