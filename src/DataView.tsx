import React from 'react'
import {DataGrid, ColDef} from '@material-ui/data-grid'
import Searchbar from './Searchbar'
import {grabData} from './GrabDataHelpers';

const columns: ColDef[] = [
    { field: 'state', headerName: "State", width: 130 },
    { field: 'positive', headerName: "Positive", width: 130 },
    { field: 'negative', headerName: "Negative", width: 130 },
    { field: 'death', headerName: "Deaths", width: 130 },
    { field: 'pending', headerName: "Pending", width: 130 }
]

interface StateData {
    state: string,
    positive: number | null,
    negative: number | null,
    death: number | null,
    pending: number | null,
}
// Specifically for use with the data grid
interface StateRowData extends StateData {
    id: number,
}

type DataViewState = {
    rows: StateRowData[]
}
export class DataView extends React.Component<{}, DataViewState> {
    state: DataViewState = {
        rows: []
    };

    componentDidMount() {
        grabData<StateData, StateRowData>("https://api.covidtracking.com/v1/states/current.json",
            (val, index) => {
                return {...val, id: index}
            })
            .then((val) => this.setState({rows: val}));
    }

    render() {
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
                    <Searchbar />
                    <header><h1>Current state counts</h1></header>
                </div>
                <DataGrid 
                    rows={this.state.rows} 
                    columns={columns} 
                    pageSize={15} 
                    autoHeight={true}
                    disableSelectionOnClick={true}/>
            </div>
        )
    }
}