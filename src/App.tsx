import React from 'react';
import styles from './App.module.css'; // ensures that there is no interference. more -> https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822
import {MapView} from './components/MapView';
import {DataView} from './components/DataView';
import {GraphView} from './components/GraphView';

import {grabDataTest} from './dataretreival';

// TODO: for Chuck. Remember to use module.css instead of plain .css so we can apply that style is not being applied to all of the components.
class App extends React.Component {
    // constructor is implicitly created
    currentInformation = {
        data: {}
    };
    async componentDidMount() {
        const pulledData = await grabDataTest();
        console.log(pulledData);
        //this.setState({ data: pulledData });
    }
    render(){
        // pulling data out of currentInformation to be used as a propertie for our components.
        const { data } = this.currentInformation;
        
        return (
            <div className={styles.container}>
                <DataView></DataView>
            </div>
        );
    }
}

export default App;
