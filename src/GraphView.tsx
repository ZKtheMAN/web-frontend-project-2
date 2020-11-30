import React from 'react';
import {ResponsiveLine} from '@nivo/line';
import {grabData} from './GrabDataHelpers';
import Searchbar from './Searchbar';

// taken direct from Nivo's website lmao
interface GraphLine {
    id: string | number,
    data: Array<{
        x: number | string | Date,
        y: number | string | Date
    }>
}

interface StateHistoryData {
    date: number,
    positive: number,
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
            (val: StateHistoryData, index) => {
                let dateAsString = val.date.toString();
                let formString = dateAsString.substring(0, 4) + "-" + dateAsString.substring(4, 6) + "-" + dateAsString.substring(6);
                return {
                    x: formString,
                    y: val.positive
                }
            }
        ).then((x) => this.setState({
            graphData: [{
                id: 0,
                data: x.reverse()
            }]
        }));
    }

    render() {
        return (
            <div className="GraphView">
                <div style={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Searchbar />
                    <header><h1>California state history</h1></header>
                </div>
                <div style={{height: "85vh"}}>
                    <ResponsiveLine 
                        data={this.state.graphData}
                        enablePoints={false}
                        xScale={{
                            type: 'time',
                            format: '%Y-%m-%d',
                            useUTC: true,
                        }}
                        xFormat="time:%Y-%m-%d"
                        yScale={{
                            type: 'linear',
                        }}
                        yFormat=">,.2f"
                        margin={{
                            top: 0,
                            bottom: 40,
                            left: 60,
                            right: 50
                        }}
                        axisBottom={{
                            orient: 'bottom',
                            format: '%Y-%m-%d',
                            tickSize: 5,
                            tickPadding: 5,
                            legend: 'Time',
                            legendPosition: 'middle',
                            legendOffset: 30,
                        }}
                    />
                </div>
            </div>
        )
    }
}