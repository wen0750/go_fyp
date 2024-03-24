import { Cancel, Tag } from "@mui/icons-material";
import { FormControl, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";

const Tags = ({ data, handleDelete }) => {
    return (
        <Box
            sx={{
                background: "rgba(0, 0, 0, 0.08)",
                height: "100%",
                display: "flex",
                padding: "0.4rem 0.8rem",
                margin: "0 0.5rem 0.5rem 0",
                borderRadius: "25px",
                justifyContent: "center",
                alignContent: "center",
                color: "rgba(0, 0, 0, 0.87)",
            }}
        >
            <Stack direction="row" gap={1}>
                <Typography
                    sx={{
                        fontSize: "0.8125rem",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {data}
                </Typography>
                <Cancel
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                        handleDelete(data);
                    }}
                />
            </Stack>
        </Box>
    );
};
const classes = (theme) => ({
    input: {
        color: "white",
        height: 1,
    },
});

export default function InputTags(props) {
    const [tags, SetTags] = useState([]);
    const tagRef = useRef();

    const handleDelete = (value) => {
        const newtags = tags.filter((val) => val !== value);
        SetTags(newtags);
        props.cbFunc(newtags);
    };
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (tagRef.current.value != "" && !tags.includes(tagRef.current.value)) {
            SetTags([...tags, tagRef.current.value]);
            props.cbFunc([...tags, tagRef.current.value]);
            tagRef.current.value = "";
        }
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={handleOnSubmit}>
                <TextField
                    sx={{ height: 1, display: "grid" }}
                    inputRef={tagRef}
                    variant="outlined"
                    label="Enter Hosts"
                    placeholder={tags.length < 5 ? "Enter host(s) (eg. 8.8.8.8)" : ""}
                    InputProps={{
                        startAdornment: (
                            <Box
                                sx={{
                                    margin: "0 0.2rem 0 0",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    paddingBlock: "0.7rem",
                                }}
                            >
                                {tags.map((data, index) => {
                                    return <Tags data={data} handleDelete={handleDelete} key={index} />;
                                })}
                            </Box>
                        ),
                    }}
                />
            </form>
        </Box>
    );
}
