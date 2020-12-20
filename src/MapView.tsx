import React, {useState,useEffect} from 'react';
import Searchbar from './Searchbar';
import * as L from "leaflet";
import { Circle, MapContainer, TileLayer, useMap,Popup } from 'react-leaflet';
import {states, latlngs,getMapData,getCountryData} from './GrabDataHelpers'

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

type MapViewState = {
    center: [number, number],
    zoom: number,
    data:[]

};
export class MapView extends React.Component<{}, MapViewState> {
    state: MapViewState = {
        center: [37.0902, -95.7129],
        zoom: 5,
        data:[]

    }

    focusMapToLocation(location: string) {
        var stateIndex = states.indexOf(location);
        var latlng = latlngs[stateIndex];
        

        this.setState({
            center: latlng,
            zoom: 6,
            data:[],
        });
    }

    render() {
        /*****/
        getMapData();
        getCountryData("USA");

        return (
            <div className="MapView">
                <Searchbar 
                    absolutePosition={{x: 150, y: 14}}
                    pressEnterEvent={(val) => this.focusMapToLocation(val)} // TODO // 
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
                    <Circle center={[51.505, -0.09]} radius={1000000} />
                    <SetCenterAndZoom 
                        center={this.state.center}
                        zoom={this.state.zoom}/>
                </MapContainer>
            </div>
        );
    }
}