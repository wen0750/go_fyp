import Editor from "../../page/editor";
import ProjectFolder from "../../page/folder";
import ProjectItem from "../../page/project";

const Item = (props) => {
    const { page, path, index } = props;

    switch (path) {
        case "folder":
            return <ProjectFolder pid={index} />;
        case "project":
            return <ProjectItem />;
        case "editor":
            return <Editor />;
        default:
            return <div id="page">{page}</div>;
    }
};

export default Item;
