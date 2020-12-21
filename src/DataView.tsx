import React from 'react'
import {DataGrid, ColDef, SortModel} from '@material-ui/data-grid'
import Searchbar from './Searchbar'
import {CountryData, getMapData, getUSData, StateDataCurrent, states} from './GrabDataHelpers';
import { MenuItem, Select } from '@material-ui/core';

const statesColumns: ColDef[] = [
    { field: 'state', headerName: "State", width: 260 },
    { field: 'cases', headerName: "Cases", width: 130 },
    { field: 'todayCases', headerName: "Today", width: 130 },
    { field: 'deaths', headerName: "Deaths", width: 130 },
    { field: 'recovered', headerName: "Recovered", width: 130}
]

const globalColumns: ColDef[] = [
    { field: 'country', headerName: "Country", width: 260 },
    { field: 'cases', headerName: "Cases", width: 130 },
    { field: 'todayCases', headerName: "Today", width: 130 },
    { field: 'deaths', headerName: "Deaths", width: 130 },
    { field: 'recovered', headerName: "Recovered", width: 130}
]

// Specifically for use with the data grid
interface StateRowData extends StateDataCurrent {
    id: number,
}
interface GlobalRowData extends CountryData {
    id: number
}

type DataViewState = {
    stateRows: StateRowData[],
    tablePage: number,
    globalOrStates: "global" | "states",
    globalRows: GlobalRowData[],
    tableSortModel: SortModel
}
export class DataView extends React.Component<{}, DataViewState> {
    state: DataViewState = {
        stateRows: [],
        tablePage: 1,
        globalOrStates: "global",
        globalRows: [],
        tableSortModel: []
    };

    componentDidMount() {
        getUSData()
            .then((val) => 
                this.setState({
                    stateRows: val.map((x: StateDataCurrent, index: number): StateRowData => ({...x, id: index}))}));

        getMapData()
            .then((val) =>
                this.setState({
                    globalRows: val.map((x: CountryData, index: number): GlobalRowData => ({...x, id: index}))}));
    }

    changeGlobalOrState(event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) {
        let val = event.target.value;
        
        if (val === "global" || val === "states") {
            this.setState({
                globalOrStates: val,
                tablePage: 1
            })
        }
    }

    searchForLocation(location: string) {
        if (this.state.globalOrStates === "global") {
            return this.state.globalRows.findIndex((x) => x.country === location);
        } else {
            return this.state.stateRows.findIndex((x) => x.state === location);
        }
    }

    render() {
        var whichRows, whichCols;
        if (this.state.globalOrStates === "global") {
            whichRows = this.state.globalRows;
            whichCols = globalColumns;
        } else {
            whichRows = this.state.stateRows;
            whichCols = statesColumns;
        }

        return (
            <div className="DataView" style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Searchbar 
                        autofills={states}
                        pressEnterEvent={(val) => {
                            let index = this.searchForLocation(val);
                            if (index !== -1)
                                this.setState({
                                    // table pages start at 1 for some dumb reason
                                    tablePage: Math.ceil(index / 15)
                                })
                        }} // TODO //
                        />
                    <header><h1><span>Current </span> 
                        <Select
                            defaultValue={"global"}
                            onChange={(x) => this.changeGlobalOrState(x)}
                            style={{
                                fontSize: 30,
                                fontFamily: "Roboto;sans-serif",
                                fontWeight: "bold",
                            }}
                            disableUnderline={true}
                            margin={"dense"}>
                            <MenuItem value={"global"}>global</MenuItem>
                            <MenuItem value={"states"}>states</MenuItem>
                        </Select>
                         counts</h1></header>
                </div>
                <DataGrid 
                    rows={whichRows} 
                    columns={whichCols} 
                    pageSize={15} 
                    autoHeight={true}
                    disableSelectionOnClick={true}
                    page={this.state.tablePage}
                    onPageChange={(params) => {
                        this.setState({
                            tablePage: params.page
                        });
                    }}
                    sortModel={this.state.tableSortModel}
                    onSortModelChange={(x) => 
                        this.setState({
                            tableSortModel: x.sortModel
                        })
                    }
                    />
            </div>
        )
    }
}