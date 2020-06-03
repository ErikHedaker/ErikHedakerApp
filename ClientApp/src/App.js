import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { AboutMe } from './components/AboutMe';
import { Overview } from './components/Overview';
import { Dungeoncrawler } from './components/Dungeoncrawler';
import { Snake } from './components/Snake';
import { Button, ButtonGroup } from 'reactstrap';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: "sv"
        };
    }

    ButtonToggleLanguage() {
        let LanguageSet = key => {
            this.setState({ language: key });
        };
        const style = {
            English: { backgroundColor: this.state.language === "en" ? "royalblue" : "gray" },
            Swedish: { backgroundColor: this.state.language === "sv" ? "royalblue" : "gray" },
            Language: {
                position: "fixed",
                top: "0",
                right: "0",
                margin: "16px"
            }
        }

        return (
            <ButtonGroup size="sm" style={style.Language}>
                <Button style={style.English} onClick={LanguageSet.bind(this, "en")}>en</Button>
                <Button style={style.Swedish} onClick={LanguageSet.bind(this, "sv")}>sv</Button>
            </ButtonGroup>
        );
    }

    render() {
        return (
            <div>
                <Layout language={this.state.language}>
                    <Route exact path='/' render={(props) => <Home {...props} language={this.state.language} />} />
                    <Route path='/AboutMe' render={(props) => <AboutMe {...props} language={this.state.language} />} />
                    <Route path='/Overview' render={(props) => <Overview {...props} language={this.state.language} />} />
                    <Route path='/Dungeoncrawler' render={(props) => <Dungeoncrawler {...props} language={this.state.language} />} />
                    <Route path='/Snake' render={(props) => <Snake {...props} language={this.state.language} />} />
                </Layout>
                {this.ButtonToggleLanguage()}
            </div>
        );
    }
}