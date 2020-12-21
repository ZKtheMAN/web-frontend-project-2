import React from 'react';
import Searchbar from './Searchbar';
import * as L from "leaflet";
import { Circle, MapConsumer, MapContainer, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import {getMapData, getCountryData, getUSData, CountryData, StateDataCurrent, StateHistoryData, states, latlngs, LocationData, extractData} from './GrabDataHelpers'
import { InputLabel, MenuItem, Paper, Select } from '@material-ui/core';

// This is a kludge that I really don't see any other way around.
// Apparently, a React leaflet map can't be manually controlled after it's created.
// Changing its props through changing state won't do NOTHIN.
// You have to get a subelement to call useMap() to then modify its properties
// using Leaflet's own API.
// Stoopid.
type SetCenterAndZoomProps= {
    center: [number, number],
    zoom: number
}
function SetCenterAndZoom(props: SetCenterAndZoomProps) {
    var map = useMap();
    map.setView(props.center, props.zoom);

    return (<></>) // god this feels so scuffed
}

/*
// The above also goes for the EVENTS, too.
// Wanna do something after the zoom has changed?
// Too bad! Make a new component to do the work.
type ZoomChangeEvent = (bounds: L.LatLngBounds) => void;
function OnZoomChange(props: {callback: ZoomChangeEvent}) {
    let zoom = useMap().getBounds()
    useMapEvents({
        zoomstart: () => props.callback(zoom)
    });

    return (<></>) // STILL SCUFFED
}
*/

type MapViewState = {
    center: [number, number],
    zoom: number,
    countriesData: CountryData[],
    globalOrStates: "global" | "states",
    statesData: StateDataCurrent[],
    dataKind: "total" | "today" | "deaths" | "recovered"
};
export class MapView extends React.Component<{}, MapViewState> {
    state: MapViewState = {
        center: [20, 0],
        zoom: 3,
        countriesData: [],
        globalOrStates: "global",
        statesData: [],
        dataKind: "total"
    }

    /*
    // Okay, so this is weird, but I don't really know another way around this.
    // We're keeping track of this because of the kludge mentioned above.
    // Essentially, I only want to have the SetZoomEtc component on for
    // ONE RENDER. Since we can't track that in state because that'll
    // trigger re-renders, we're doing it here.
    rendersSinceLastRefocus = 0;
    */

    componentDidMount() {
        getMapData()
            .then((x: CountryData[]) => {
                this.setState({
                    countriesData: x
                });
            });

        getUSData()
            .then((x: StateDataCurrent[]) => {
                this.setState({
                    statesData: x
                });
            });
    }

    focusMapToLocation(location: string) {
        getCountryData(location)
            .then((x) => {
                this.setState({
                    center: [x.countryInfo.lat, x.countryInfo.long],
                    zoom: 5
                })
            });
    }

    changeGlobalOrStates(event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) {
        let val = event.target.value;

        if (val === "global" || val === "states")
            this.setState({
                globalOrStates: val
            });
    }

    changeDataKind(event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
        let val = event.target.value;

        if (val === "today" || val === "total" || val === "deaths" || val === "recovered")
            this.setState({
                dataKind: val
            });
    }

    circleScaleFactor(): number {
        switch (this.state.dataKind) {
            case "total": return 0.1;
            case "today": return 7;
            case "deaths": return 1;
            case "recovered": return 0.1;
        }
    }

    render() {
        var circles;
        if (this.state.globalOrStates === "global") {
            circles = this.state.countriesData.map((x) => {
                let data = extractData(x, this.state.dataKind);
                return (<Circle 
                    center={[x.countryInfo.lat, x.countryInfo.long]} 
                    radius={data * this.circleScaleFactor()}>
                    <Popup><b>{x.country}:</b> {data}</Popup>
                </Circle>);
            });
        } else {
            circles = this.state.statesData.map((x) => {
                // We need to do extra work for the States
                // because disease.sh doesn't have geocoding data
                // for them
                var stateIndex = states.indexOf(x.state);
                if (stateIndex < 0) return undefined;

                var latlng = latlngs[stateIndex].slice();

                let data = extractData(x, this.state.dataKind);
                return (<Circle 
                    center={[latlng[0], latlng[1]]} 
                    radius={data * this.circleScaleFactor()}>
                    <Popup><b>{x.state}:</b> {data}</Popup>
                </Circle>);
            }).filter((x) => x !== undefined);
        }

        /*
        var centerOrEventTracker;
        if (this.rendersSinceLastRefocus === 0) {
            centerOrEventTracker = (<SetCenterAndZoom 
                                        center={this.state.center}
                                        zoom={this.state.zoom}/>);
        } else {
            centerOrEventTracker = (<OnZoomChange
                callback={(zoom) => {
                    console.log(zoom);
                    //if (zoom >= 5) this.setState({
                    //    showingStatesOnly: true
                    //});
                    //else this.setState({
                    //    showingStatesOnly: false
                    //})
                }}/>);
        }
        this.rendersSinceLastRefocus++;
        */

        return (
            <div className="MapView">
                <Searchbar 
                    absolutePosition={{x: 150, y: 14}}
                    pressEnterEvent={(val) => this.focusMapToLocation(val)}
                    />
                <Paper elevation={1} style={{
                    position: "absolute",
                    top: 15,
                    left: 425,
                    zIndex: 10
                }}>
                    <Select
                        defaultValue={"global"}
                        onChange={(x) => this.changeGlobalOrStates(x)}
                        style={{
                            margin: 11
                        }}>
                        <MenuItem value={"global"}>Global</MenuItem>
                        <MenuItem value={"states"}>States</MenuItem>
                    </Select>
                    <Select
                        defaultValue={"total"}
                        onChange={(x) => this.changeDataKind(x)}
                        style={{
                            margin: 11
                        }}>
                        <MenuItem value={"total"}>Total</MenuItem>
                        <MenuItem value={"today"}>Today</MenuItem>
                        <MenuItem value={"deaths"}>Deaths</MenuItem>
                        <MenuItem value={"recovered"}>Recovered</MenuItem>
                    </Select>
                </Paper>
                <MapContainer
                    center={[20, 0]}
                    zoom={3}
                    scrollWheelZoom={true}
                    style={{
                        height: "100vh",
                        width: "95vw",
                        zIndex: 1
                    }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {circles}
                    <SetCenterAndZoom 
                        center={this.state.center}
                        zoom={this.state.zoom}/>
                </MapContainer>
            </div>
        );
    }
}