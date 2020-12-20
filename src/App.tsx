import React from 'react';
import {Button} from '@material-ui/core';
import {Public, TableChart, Assessment} from '@material-ui/icons';
import './App.css';
import {MapView} from './MapView';
import {DataView} from './DataView';
import {GraphView} from './GraphView';


enum AppView {
    Map,
    Data,
    Graph
}
type AppState = {
    currentView: AppView,
    data:{}
}
class App extends React.Component<{}, AppState> {
    state = {
        currentView: AppView.Map,
        data:{}
    };

    render() {
        var view;
        switch (this.state.currentView) {
            case AppView.Map:
                view = <MapView></MapView>;
                break;
            case AppView.Data:
                view = <DataView></DataView>;
                break;
            case AppView.Graph:
                view = <GraphView></GraphView>;
                break;
        }

        return (
            <div className="App">
                <div className="nav-rail">
                    <Button onClick={() => {this.setState({currentView: AppView.Map})}}>
                        <div className="nav-rail-button">
                            <Public />
                            <span>Map</span>
                        </div>
                    </Button>
                    <Button onClick={() => {this.setState({currentView: AppView.Data})}}>
                        <div className="nav-rail-button">
                            <TableChart />
                            <span>Data</span>
                        </div>
                    </Button>
                    <Button onClick={() => {this.setState({currentView: AppView.Graph})}}>
                        <div className="nav-rail-button">
                            <Assessment />
                            Graph
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
