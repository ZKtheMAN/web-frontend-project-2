import React from 'react';
import {Button} from '@material-ui/core';
import {Public, TableChart, Assessment, Info} from '@material-ui/icons';
import './App.css';
import {MapView} from './MapView';
import {DataView} from './DataView';
import {GraphView} from './GraphView';
import { AboutView } from './AboutView';



type AppState = {
    currentView: "map" | "data" | "graph" | "about"
}
class App extends React.Component<{}, AppState> {
    state: AppState = {
        currentView: "map"
    };

    render() {
        var view;
        switch (this.state.currentView) {
            case "map":
                view = <MapView />;
                break;
            case "data":
                view = <DataView />;
                break;
            case "graph":
                view = <GraphView />;
                break;
            case "about":
                view = <AboutView />
        }

        return (
            <div className="App">
                <div className="nav-rail">
                    <Button onClick={() => {this.setState({currentView: "map"})}}>
                        <div className="nav-rail-button">
                            <Public />
                            <span>Map</span>
                        </div>
                    </Button>
                    <Button onClick={() => {this.setState({currentView: "data"})}}>
                        <div className="nav-rail-button">
                            <TableChart />
                            <span>Data</span>
                        </div>
                    </Button>
                    <Button onClick={() => {this.setState({currentView: "graph"})}}>
                        <div className="nav-rail-button">
                            <Assessment />
                            Graph
                        </div>
                    </Button>
                    <Button onClick={() => this.setState({currentView: "about"})}>
                        <div className="nav-rail-button">
                            <Info />
                            About
                        </div>
                    </Button>
                </div>
                <div style={{width: "95%"}}>
                    {view}
                </div>
            </div>
        );
    }
}

export default App;
