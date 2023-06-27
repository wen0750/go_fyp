import {
    FolderCopyRoundedIcon,
    LayoutIcon,
    DrawRoundedIcon,
} from "./sidebar_icon";

export const SIDEBAR_DATA = [
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
];
