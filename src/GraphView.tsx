import React from 'react';
import {ResponsiveLine} from '@nivo/line';
import {grabData} from './GrabDataHelpers';

// taken direct from Nivo's website lmao
interface GraphLine {
    id: string | number,
    data: Array<{
        x: number | string | Date,
        y: number | string | Date
    }>
}

type GraphViewState = {
    graphData: GraphLine[]
}
export class GraphView extends React.Component<{}, GraphViewState> {
    state = {
        graphData: []
    }

    componentDidMount() {
        grabData("https://api.covidtracking.com/v1/states/ca/daily.json",
                (val, index) => {
                    
                })
    }

    render() {
        return (
            <p>bitch</p>
        )
    }
}