import React from 'react';
import {ResponsiveLine} from '@nivo/line';
import {ResponsiveBar} from '@nivo/bar';
import { Chip, Menu, MenuItem } from '@material-ui/core';
import {grabData, states, abbreviations} from './GrabDataHelpers';
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
    graphData: GraphLine[],
    barOrLine: "bar" | "line",
    barOrLineMenuOpen: boolean
}
export class GraphView extends React.Component<{}, GraphViewState> {
    state: GraphViewState = {
        graphData: [],
        barOrLine: "line",
        barOrLineMenuOpen: false
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
                id: "CA",
                data: x.reverse()
            }]
        }));
    }

    addLineToGraph(newLocationName: string) {
        let stateIndex = states.indexOf(newLocationName);
        let statePostal = abbreviations[stateIndex];

        grabData("https://api.covidtracking.com/v1/states/" + statePostal.toLowerCase() + "/daily.json",
            (val: StateHistoryData, index) => {
                let dateAsString = val.date.toString();
                let formString = dateAsString.substring(0, 4) + "-" + dateAsString.substring(4, 6) + "-" + dateAsString.substring(6);
                return {
                    x: formString,
                    y: val.positive
                }
            }
        ).then((x) => {
            var graphData: GraphLine[] = this.state.graphData.slice();
            var newGraphLine: GraphLine = {
                id: statePostal,
                data: x.reverse()
            }
            graphData.push(newGraphLine);
            this.setState({
                graphData: graphData
            })
        });
    }

    removeLineFromGraph(id: number | string) {
        var graphData = this.state.graphData.slice();
        var filtered = graphData.filter((x) => x.id !== id);
        this.setState({
            graphData: filtered
        });
    }

    render() {
        var locationNames = this.state.graphData.map((x) => x.id).join(", ");
        var locationChips = this.state.graphData.map((x) => <Chip label={x.id} onDelete={() => this.removeLineFromGraph(x.id)}/>);

        var barOrLineNode;
        if (this.state.barOrLine === "line") {
            barOrLineNode = (<ResponsiveLine 
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
                    left: 120,
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
                legends={[{
                    anchor: "top-left",
                    direction: "column",
                    itemWidth: 80,
                    itemHeight: 20,
                    translateX: -120
                }]}
            />);
        } else {
            // Construct current values from the historical values we have right now
            var currentValues = this.state.graphData.map((x) => {
                return {
                    id: x.id,
                    value: x.data[x.data.length - 1].y // I think this works?
                }
            });

            barOrLineNode = (<ResponsiveBar
                    data={currentValues}
                    indexBy={"id"}
                    margin={{
                        top: 0,
                        bottom: 60,
                        left: 60,
                        right: 0
                    }}
                />
            );
        }

        var historyOrCurrent;
        if (this.state.barOrLine === "line") {
            historyOrCurrent = "history";
        } else {
            historyOrCurrent = "current";
        }

        return (
            <div className="GraphView">
                <div style={{
                    display: 'flex',
                    flexDirection: "row",
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Searchbar 
                        pressEnterEvent={(val) => this.addLineToGraph(val)} // TODO //
                        />
                    <header><h1>{locationNames}  
                        <button style={{
                            background: "none",
                            border: "none",
                            padding: 5,
                            fontFamily: "Roboto;sans-serif",
                            fontWeight: "bold",
                            fontSize: 30,
                            textDecoration: "underline",
                            cursor: "pointer"
                        }}
                        onClick={() => this.setState({barOrLineMenuOpen: true})}> 
                            {historyOrCurrent}
                            <Menu 
                                open={this.state.barOrLineMenuOpen}
                                onClose={() => this.setState({barOrLineMenuOpen: false})}>
                                <MenuItem onClick={() => this.setState({barOrLine: "line", barOrLineMenuOpen: false})}>History</MenuItem>
                                <MenuItem onClick={() => this.setState({barOrLine: "bar", barOrLineMenuOpen: false})}>Current</MenuItem>
                            </Menu>
                        </button>
                    </h1></header>
                </div>
                {locationChips}
                <div style={{height: "85vh"}}>
                    {barOrLineNode}
                </div>
            </div>
        )
    }
}