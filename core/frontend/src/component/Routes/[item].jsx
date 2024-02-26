import { useParams, useLocation } from "react-router-dom";

import Editor from "../../page/editor";
import ProjectFolder from "../../page/folder";
import ProjectItem from "../../page/project";
import TerminalBody from "../../page/terminal";

const Item = (props) => {
    const { page } = props;
    switch (page) {
        case "folder":
            let { fid } = useParams();
            if (typeof fid == "undefined") {
                fid = "";
            }
            return <ProjectFolder fid={fid} />;
        case "project":
            let { pid } = useParams();
            let { state } = useLocation();
            return <ProjectItem pid={pid} name={state} />;
        case "editor":
            return <Editor />;
        case "terminal":
            return <TerminalBody />;
        default:
            return <div id="page">{page}</div>;
    }
};

export default Item;
