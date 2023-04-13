import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button
} from "@mui/material";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./assets/css/editor.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder"
];

function methodSelector() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = event => {
    const {target: {
        value
      }} = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string"
      ? value.split(",")
      : value);
  };

  return (<FormControl>
    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
    <Select labelId="demo-multiple-name-label" id="demo-multiple-name" multiple="multiple" value={personName} onChange={handleChange} input={<OutlinedInput label = "Name" />} MenuProps={MenuProps}>
      {
        names.map(name => (<MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
          {name}
        </MenuItem>))
      }
    </Select>
  </FormControl>);
}

function TemplateInfo() {
  return (<Card>
    <CardHeader title="Template"/>
    <hr/>
    <CardContent>
      <Grid container="container" spacing={2} columns={{
          xs: 4,
          sm: 8,
          md: 12
        }}>
        <Grid item="item">
          <TextField required="required" label="Risk Level"/>
        </Grid>
        <Grid item="item">
          <TextField required="required" id="outlined-required" label="Required" defaultValue="Hello World"/>
        </Grid>

        <Grid item="item">
          <TextField label="description"/>
        </Grid>
        <Grid item="item">
          <TextField label="reference (list)"/>
        </Grid>
        <Grid item="item">
          <TextField label="cvss-metrics"/>
        </Grid>
        <Grid item="item">
          <TextField label="cvss-score"/>
        </Grid>
        <Grid item="item">
          <TextField label="cve-id"/>
        </Grid>
        <Grid item="item">
          <TextField label="cwe-id"/>
        </Grid>
        <Grid item="item">
          <TextField label="remediation"/>
        </Grid>
        <Grid item="item">
          <TextField label="verified"/>
        </Grid>
        <Grid item="item">
          <TextField label="fofa-query"/>
        </Grid>
        <Grid item="item">
          <TextField label="shodan-query"/>
        </Grid>
        <Grid item="item">
          <TextField label="google-query"/>
        </Grid>
        <Grid item="item">
          <TextField label="tags"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
      </Grid>
    </CardContent>
  </Card>);
}

function TemplateRequest() {
  return (<Card>
    <CardHeader title="Template"/>
    <hr/>
    <CardContent>
      <Grid container="container" spacing={2} columns={{
          xs: 4,
          sm: 8,
          md: 12
        }}>
        <Grid item="item">
          <methodSelector/>
        </Grid>
        <Grid item="item" xs={4}>
          <TextField label="path"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
        <Grid item="item">
          <TextField label="author"/>
        </Grid>
      </Grid>
    </CardContent>
  </Card>);
}

function Editor() {
  return (<div>
    <TemplateInfo/>
    <TemplateRequest/>
  </div>);
}

export default Editor;
