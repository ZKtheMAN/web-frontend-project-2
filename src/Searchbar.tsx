import { InputAdornment, Paper, TextField } from "@material-ui/core";
import React from "react";
import SearchIcon from "@material-ui/icons/Search"

type SearchbarSubmitEvent = (value: string) => void;

type SearchbarProps = {
    absolutePosition?: {x: number | string, y: number | string},
    autofills?: string[],
    pressEnterEvent: SearchbarSubmitEvent
};
type SearchbarState = {
    textFieldVal: string,
    autofillVisible: boolean
};
class Searchbar extends React.Component<SearchbarProps, SearchbarState> {
    static defaultProps = {};
    state = {
        textFieldVal: "",
        autofillVisible: false
    }

    render() {
        var styleObj: React.CSSProperties = {
            width: "258px",
            marginLeft: 0,
            marginRight: 10
        };
    
        if (this.props.absolutePosition !== undefined) {
            styleObj.position = "absolute";
            styleObj.top = this.props.absolutePosition?.y;
            styleObj.left = this.props.absolutePosition?.x;
            styleObj.zIndex = 10;
        }
    
        return (
            <div className="Searchbar">
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
                        onChange={(event) => {
                            this.setState({
                                textFieldVal: event.target.value
                            });
                        }}
                        onKeyUp={(event) => {
                            if (event.key === "Enter")
                                this.props.pressEnterEvent(this.state.textFieldVal);
                        }}
                    />
                </Paper>

            </div>
        )
    }
}

export default Searchbar;