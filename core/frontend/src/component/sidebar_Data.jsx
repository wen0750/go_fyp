import {
    FolderCopyRoundedIcon,
    LayoutIcon,
    DrawRoundedIcon,
} from "./sidebar_icon";

const hardData = [
    {
        id: 1,
        name: "project folder",
        path: "folder",
        icon: <FolderCopyRoundedIcon />,
    },
    {
        id: 2,
        name: "project item",
        path: "project",
        icon: <LayoutIcon />,
    },
    {
        id: 3,
        name: "template editor",
        path: "editor",
        icon: <DrawRoundedIcon />,
    },
    /* 
    {
        id: 4,
        name: "terminal",
        path: "editor",
        icon: <TerminalIcon />,
    },
    */
];

const dataFetch = async () => {
    const data = await (
        await fetch("http://127.0.0.1:8888/folder/list", {
            method: "POST",
        })
    ).json();

    var list = [];
    data.map((val) =>
        list.push({
            id: val._id,
            name: val.name,
            path: "folder",
            icon: <FolderCopyRoundedIcon />,
        })
    );

    console.log(list.concat(hardData));

    return list.concat(hardData);
};

export const SIDEBAR_DATA = await dataFetch();
