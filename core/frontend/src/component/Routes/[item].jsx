import Editor from "../../page/editor";
import ProjectFolder from "../../page/folder";
import ProjectItem from "../../page/project";

const Item = (props) => {
    const { page, path } = props;

    switch (path) {
        case "folder":
            return <ProjectFolder />;
        case "project":
            return <ProjectItem />;
        case "editor":
            return <Editor />;
        default:
            return <div id="page">{page}</div>;
    }
};

export default Item;
