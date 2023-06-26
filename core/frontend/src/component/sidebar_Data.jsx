import {
    FolderCopyRoundedIcon,
    LayoutIcon,
    CalendarIcon,
    InvoiceIcon,
    UserIcon,
    RolesIcon,
    PagesIcon,
    AuthIcon,
    WizardIcon,
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
        name: "Calendar",
        path: "calendar",
        icon: <CalendarIcon />,
    },
    {
        id: 4,
        name: "Invoice",
        path: "invoice",
        icon: <InvoiceIcon />,
    },
    {
        id: 5,
        name: "Users",
        path: "users",
        icon: <UserIcon />,
    },
    {
        id: 6,
        name: "Roles & Permissions",
        path: "roles",
        icon: <RolesIcon />,
    },
    {
        id: 7,
        name: "Pages",
        path: "pages",
        icon: <PagesIcon />,
    },
    {
        id: 8,
        name: "Authentication",
        path: "authentication",
        icon: <AuthIcon />,
    },
    {
        id: 9,
        name: "Wizard Examples",
        path: "wizard",
        icon: <WizardIcon />,
    },
    {
        id: 10,
        name: "template editor",
        path: "editor",
        icon: <DrawRoundedIcon />,
    },
];
