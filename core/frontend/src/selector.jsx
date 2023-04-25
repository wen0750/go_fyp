import React, { Component, useState } from 'react'

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export default class SigleSelect extends Component {
    constructor(props) {
        super(props)

        const ITEM_HEIGHT = 40;
        const ITEM_PADDING_TOP = 8;

        //[this.personName, this.setPersonName] = useState(0);

        this.menuProps = {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 220,
                },
            },
        };
        
    }

    handleChange = (event) => {
        const {
            target: { value },
        } = event;
        this.setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
    };

    render() {
        return (
            <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-multiple-chip-label">{this.props.label}</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    value={this.personName}
                    onChange={this.handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label={this.props.label} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <span>{value}</span>
                            ))}
                        </Box>
                    )}
                    MenuProps={this.MenuProps}
                >
                    {this.props.list.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}