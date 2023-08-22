import Editor from "../../page/editor";
import ProjectFolder from "../../page/folder";
import ProjectItem from "../../page/project";

const Item = (props) => {
    const { page } = props;
    console.log(props);
    switch (page) {
        case "folder":
            const { fid } = props;
            return <ProjectFolder fid={fid} />;
        case "project":
            return <ProjectItem />;
        case "editor":
            return <Editor />;
        default:
            return <div id="page">{page}</div>;
    }
};

export default Item;
