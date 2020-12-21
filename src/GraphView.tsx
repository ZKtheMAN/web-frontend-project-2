import React from 'react';
import {ResponsiveLine} from '@nivo/line';
import {ResponsiveBar} from '@nivo/bar';
import { Chip, FormControl, Menu, MenuItem, Paper, Select } from '@material-ui/core';
import {grabData, states, abbreviations, getCountryHistoricalData, CountryHistoricalData} from './GrabDataHelpers';
import Searchbar from './Searchbar';
import zIndex from '@material-ui/core/styles/zIndex';

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
    globalOrStates: "global" | "states"
}
export class GraphView extends React.Component<{}, GraphViewState> {
    state: GraphViewState = {
        graphData: [],
        barOrLine: "line",
        globalOrStates: "global"
    }

    componentDidMount() {
        this.addLineToGraph("USA");
    }

    addLineToGraph(newLocationName: string) {
        if (this.state.globalOrStates === "global") {
            getCountryHistoricalData(newLocationName)
                .catch(() => {
                    // This could be for a multitude of reasons,
                    // we don't have time to get into it.
                    return;
                })
                .then((x) => {
                    if (x) {
                        // this feels dirty.
                        let dates = Object.keys(x.timeline.cases);
                        let values = Object.values(x.timeline.cases);

                        let formattedDates = dates.map((x) => {
                            let split = x.split('/');
                            return "20" + split[2].toString() + "-" + split[0].toString() + "-" + split[1].toString();
                        })

                        let zipped = formattedDates.map((x, index) => {
                            return {
                                x: x,
                                y: values[index]
                            }
                        })

                        console.log(zipped);
                        
                        let newGraphLine: GraphLine = {
                            id: x.country,
                            data: zipped
                        }

                        let graphData = this.state.graphData.slice();
                        graphData.push(newGraphLine);
                        this.setState({
                            graphData: graphData
                        })
                    }
                });
        } else {
            // States historical data from the COVID Tracking Project
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
        
    }

    removeLineFromGraph(id: number | string) {
        var graphData = this.state.graphData.slice();
        var filtered = graphData.filter((x) => x.id !== id);
        this.setState({
            graphData: filtered
        });
    }

    changeLineOrBar(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        let val = event.target.value;

        if (val === "bar" || val === "line") {
            this.setState({
                barOrLine: val
            });
        }
    }

    changeGlobalOrState(event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) {
        let val = event.target.value;
        if (val === "global" || val === "states") {
            this.setState({
                globalOrStates: val,
                graphData: []
            })
        } 
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
                    <Paper elevation={1} style={{
                        marginRight: 11
                    }}>
                        <Select
                            defaultValue={"global"}
                            onChange={(x) => this.changeGlobalOrState(x)}
                            style={{
                                margin: 11
                            }}>
                            <MenuItem value={"global"}>Global</MenuItem>
                            <MenuItem value={"states"}>States</MenuItem>
                        </Select>
                    </Paper>
                    <header><h1>
                        {locationNames + " "}
                        <Select 
                            defaultValue={"line"}
                            onChange={(x) => this.changeLineOrBar(x)}
                            style={{
                                fontSize: 30,
                                fontFamily: "Roboto;sans-serif",
                                fontWeight: "bold",
                            }}
                            disableUnderline={true}
                            margin={"dense"}
                                >
                            <MenuItem value={"line"}>history</MenuItem>
                            <MenuItem value={"bar"}>current</MenuItem>
                        </Select>
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