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

    LanguageSet( key ) {
        this.setState({ language: key });
    }

    ButtonToggleLanguage() {
        const colors = {
            On: "deepskyblue",
            Off: "slategray"
        }
        const styles = {
            Eng: { backgroundColor: this.state.language === "en" ? colors.On : colors.Off },
            Swe: { backgroundColor: this.state.language === "sv" ? colors.On : colors.Off },
            Position: {
                position: "fixed",
                bottom: "0",
                right: "0",
                margin: "2px",
                zIndex: "-1"
            }
        }

        return (
            <ButtonGroup style={styles.Position}>
                <Button className="button-default" style={styles.Eng} onClick={this.LanguageSet.bind(this, "en")}>en</Button>
                <Button className="button-default" style={styles.Swe} onClick={this.LanguageSet.bind(this, "sv")}>sv</Button>
            </ButtonGroup>
        );
    };

    render() {
        return (
            <div>
                <Layout language={this.state.language}>
                    <Route exact path='/'         render={(props) => <Home           {...props} language={this.state.language} />} />
                    <Route path='/AboutMe'        render={(props) => <AboutMe        {...props} language={this.state.language} />} />
                    <Route path='/Overview'       render={(props) => <Overview       {...props} language={this.state.language} />} />
                    <Route path='/Dungeoncrawler' render={(props) => <Dungeoncrawler {...props} language={this.state.language} />} />
                    <Route path='/Snake'          render={(props) => <Snake          {...props} language={this.state.language} />} />
                </Layout>
                {this.ButtonToggleLanguage()}
            </div>
        );
    }
}