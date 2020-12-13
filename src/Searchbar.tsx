import { InputAdornment, Paper, TextField } from "@material-ui/core";
import React from "react";
import SearchIcon from "@material-ui/icons/Search"

type SearchbarProps = {
    absolutePosition?: {x: number | string, y: number | string}
};
const defaultSearchbarProps = {};
const Searchbar: React.FunctionComponent<SearchbarProps> = (props) => {
    var styleObj: React.CSSProperties = {
        width: "258px",
        marginLeft: 0,
        marginRight: 10
    };

    if (props.absolutePosition !== undefined) {
        styleObj.position = "absolute";
        styleObj.top = props.absolutePosition?.y;
        styleObj.left = props.absolutePosition?.x;
        styleObj.zIndex = 10;
    }

    return (
        <Paper elevation={1} style={styleObj}>
            <TextField
                placeholder="Search..."
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                onKeyUp={(event) => {
                    if (event.key === "Enter") {
                        alert("ayy");
                    }
                }}
            />
        </Paper>
    )
}

Searchbar.defaultProps = defaultSearchbarProps;

export default Searchbar;