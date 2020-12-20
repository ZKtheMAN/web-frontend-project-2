import React from 'react';
import { Searchbar } from './Searchbar'
import { MapContainer, TileLayer } from 'react-leaflet';

export function MapView() {
    return (
        <div className="MapView">
            <Searchbar />
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={false}
                style={{
                    height: "51vw",
                    width: "100vw",
                    zIndex: 1
                }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}