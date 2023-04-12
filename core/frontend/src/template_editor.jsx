import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import './assets/css/editor.css'

function Editor() {
  return (
      <Box component="form" sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }} noValidate autoComplete="off">
      <div>
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Hello World"
        />
        <TextField
          id="outlined-number"
          label="Number"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField id="outlined-search" label="Search field" type="search" />
        <TextField
          id="outlined-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
        />
      </div>
    </Box>
  )
}

export default Editor
