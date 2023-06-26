import { Link } from "react-router-dom";
import { ArrowBackIcon } from "../sidebar_icon";
import { StyledEngineProvider } from "@mui/material/styles";

import Editor from "../../page/editor";

const Item = (props) => {
    const { page } = props;

    switch (page) {
        case "editor":
            return <Editor />;
        default:
            return <div id="page">{page}</div>;
    }
};

export default Item;
