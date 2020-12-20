import { InputAdornment, Paper, TextField } from "@material-ui/core";
import React from "react";
import SearchIcon from "@material-ui/icons/Search"

/* keeping this for later
                style={{
                    position: "absolute",
                    top: "1vw",
                    left: "1vw",
                    zIndex: 10,
                }}*/

export function Searchbar() {
    return (
        <Paper elevation={1}>
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
                            alert("ayy"); // L 0 L
                        }
                    }}
                />
            </Paper>
    )
}