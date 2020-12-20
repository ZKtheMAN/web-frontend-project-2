import React from 'react';
import Searchbar from './Searchbar';
import * as L from "leaflet";
import { Circle, MapConsumer, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import {getMapData, getCountryData, getUSData, CountryData, StateDataCurrent, StateHistoryData, states, latlngs} from './GrabDataHelpers'

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
    showingStatesOnly: boolean,
    statesData: StateDataCurrent[]
};
export class MapView extends React.Component<{}, MapViewState> {
    state: MapViewState = {
        center: [37.0902, -95.7129],
        zoom: 5,
        countriesData: [],
        showingStatesOnly: false,
        statesData: []
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
                    center: [x.countryInfo.lat, x.countryInfo.long]
                })
            });
    }

    render() {
        var circles;
        if (!this.state.showingStatesOnly) {
            circles = this.state.countriesData.map((x) => 
                        <Circle 
                            center={[x.countryInfo.lat, x.countryInfo.long]} 
                            radius={x.cases * 0.1} />)
        } else {
            circles = this.state.statesData.map((x) => {
                var stateIndex = states.indexOf(x.state);
                if (stateIndex < 0) return undefined;

                var latlng = latlngs[stateIndex].slice();
                return (<Circle 
                    center={[latlng[0], latlng[1]]} 
                    radius={x.cases * 0.1} />);
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
                <MapContainer
                    center={L.latLng(37.0902, -95.7129)}
                    zoom={5}
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
                </MapContainer>
            </div>
        );
    }
}