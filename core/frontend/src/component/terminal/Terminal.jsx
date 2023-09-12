/**
 * <h2>NotUnix-Terminal</h2>
 * <p>Terminal component is a component that allows you to interact with the system</p>
 * @copyright 2023
 * <a href="https://github.com/abderox">abderox</a>
 */

import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React from "react";

const Terminal = ({ title = "My Terminal", handleClose, rebootTerminal }) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const username = "abderox";
    const [inputValue, setInputValue] = React.useState("");
    const [outputValue, setOutputValue] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [today, setDate] = React.useState(new Date());
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
    const reff = React.useRef(null);
    const [history, setHistory] = React.useState([]);
    const [historyIndex, setHistoryIndex] = React.useState(0);
    const [initialCommand, setInitialCommand] = React.useState(
        `Notlunix\\github\\>${username ? username : "guest"}@${title
            .toLowerCase()
            .replace(" ", "")}:~$ `
    );
    const [width, setWidth] = React.useState(2 / 3);
    const [height, setHeight] = React.useState(2 / 3);
    const draggableRef = React.useRef(null);
    const innerRef = React.useRef(null);

    // ? example of permissions
    const permissions = [
        {
            name: "ADMIN_00",
            roles: [
                {
                    name: "list users",
                },
                {
                    name: "add user",
                },
            ],
        },
        {
            name: "ADMIN_01",
            roles: [
                {
                    name: "list users",
                },
                {
                    name: "add user",
                },
            ],
        },
    ];

    // ? add as many commands as you want
    const mapCommands = new Map([
        ["help", "help - list all commands"],
        ["clear", "clear - clear the terminal screen"],
        ["echo", "echo - echo arguments to the standard output"],
        ["whoami", "whoami - print effective username"],
        ["reload", "reload - reload the terminal"],
        ["history", "history - show the history of commands"],
        ["clear history", "clear history - clear the history of commands"],
        ["date", "date - print the system date and time"],
        ["pwp", "pwd - print name of current/working page"],
        ["exit", "exit - cause the shell to exit"],
        ["reboot", "reboot - reboot the system"],
        ["logout", "logout - logout from the platform"],
        ["u -r", "user management - redirection to page"],
    ]);

    React.useEffect(() => {
        setOutputValue(``);
        setHistory([]);
        setDate(new Date());
        setMessage("");
    }, []);

    React.useEffect(() => {
        if (reff.current) {
            reff.current.scrollTop = reff.current.scrollHeight;
        }
    }, [outputValue]);

    /*
     * ? add as many methods as you want according to your needs
     * from here
     */

    // ? logout from the terminal
    const handleLogout = () => {
        setMessage(`Logging out... \n`);
        setTimeout(() => {
            // some logic like dispatching logout action
            setInitialCommand(
                `Notlunix\\github\\>guest@${title
                    .toLowerCase()
                    .replace(" ", "")}:~$ `
            );
        }, 3000);
    };

    //? reboot the terminal
    const reboot = () => {
        setMessage(`Rebooting... \n Please be patient...`);
        if (rebootTerminal) {
            rebootTerminal();
        }
        setTimeout(() => {
            setInputValue("");
            setDate(new Date());
            setMessage("");
        }, 3000);
    };

    const redirectToPage = (command) => {
        switch (command) {
            case "u -r":
                // navigate to users page
                return "Redirecting to users page...";
            default:
                return null;
        }
    };

    const listeUserPermissions = () => {
        return permissions?.map((permission) => {
            return `--------${permission.name}--------\n${permission?.roles
                .map((role) => role.name)
                .join("\n")}`;
        });
    };

    /*
     * ? to here
     */

    /*
     * ? handle the command entered by the user
     */
    const handleCommand = (command) => {
        let output = `%%%%% ${command.trim()} ************`;
        if (command === "") {
            output +=
                'Please enter a command or type "help" to see the list of commands.\n';
            setOutputValue((prevOutput) => prevOutput + output);
            return;
        }
        if (command.trim() === "reboot") {
            reboot();
            return;
        }
        if (command.trim() === "pwp") {
            output += `${window.location.pathname}`;
            setOutputValue(output);
            return;
        }
        if (command.trim() === "clear") {
            setOutputValue("");
            return;
        }
        if (command.trim() === "exit") {
            output += "Goodbye!\n";
            setOutputValue(output);
            setTimeout(() => {
                handleCloseClick();
            }, 1500);
            return;
        }
        if (command.trim() === "help") {
            let maxLength = 0;
            mapCommands.forEach((_, key) => {
                if (key.length > maxLength) {
                    maxLength = key.length;
                }
            });
            output += ` ${"Command".padEnd(maxLength)} \t${"Description"} \n\n`;
            mapCommands.forEach((value, key) => {
                output += ` ${key.padEnd(maxLength)} \t${value} \n`;
            });
            setOutputValue((prevState) => prevState + output);
            return;
        }
        if (command.trim() === "date") {
            output += ` ${new Date().toLocaleString()}\n`;
            setOutputValue((prevState) => prevState + output);
            return;
        }
        if (command.startsWith("echo")) {
            output += ` ${command.replace("echo", "")}\n`;
            setOutputValue((prevState) => prevState + output);
            return;
        }
        if (command.toLowerCase() === "whoami") {
            output += ` ${username ?? "Guest"}\n`;
            setOutputValue((prevState) => prevState + output);
            return;
        }

        if (command.toLowerCase().trim() === "reload") {
            window.location.reload();
            return;
        }
        if (command.toLowerCase().trim() === "history") {
            history.forEach((value, index) => {
                output += ` ${index} \t\t ${value} \n`;
            });
            setOutputValue((prevState) => prevState + output);
            return;
        }
        if (command.toLowerCase().trim() === "clear history") {
            setHistory([]);
            output += ` History cleared\n`;
            setOutputValue((prevState) => prevState + output);
            return;
        }
        if (command.toLowerCase().trim() === "ls permissions") {
            output += `${listeUserPermissions()}\n`;
            setOutputValue((prevState) => prevState + output);
            return;
        }
        if (command.toLowerCase().trim() === "logout") {
            handleLogout();
            return;
        } else {
            const res = redirectToPage(command);
            if (!res) {
                output += ` Command not found: ${command}\n`;
                setOutputValue((prevState) => prevState + output);
                return;
            } else {
                output += ` ${res}\n`;
                setOutputValue((prevState) => prevState + output);
                return;
            }
        }
    };

    /*
     * these methods are used to handle the input change and the enter key press and draggability of the terminal, you can modify them according to your needs
     * or install libraries to handle them
     */

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleEnterKeyPress = (event) => {
        if (event.key === "Enter") {
            setHistory((prevHistory) => [...prevHistory, inputValue]);
            setHistoryIndex(history.length);
            handleCommand(inputValue);
            setInputValue("");
        } else if (event.key === "Tab") {
            event.preventDefault();
            mapCommands.forEach((_, key) => {
                if (key.startsWith(inputValue)) {
                    setInputValue(key);
                }
            });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (history.length > 0) {
                setHistoryIndex((prevHistoryIndex) => {
                    if (prevHistoryIndex === 0) {
                        return prevHistoryIndex;
                    }
                    return prevHistoryIndex - 1;
                });
                setInputValue(history[historyIndex]);
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (history.length > 0) {
                setHistoryIndex((prevHistoryIndex) => {
                    if (prevHistoryIndex === history.length - 1) {
                        return prevHistoryIndex;
                    }
                    return prevHistoryIndex + 1;
                });
                setInputValue(history[historyIndex]);
            }
        }
    };

    return (
        <Box
            id={"terminal"}
            ref={draggableRef}
            sx={{
                overflowY: "hidden",
                width: width,
                height: height,
                overflowX: "hidden",
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                backdropFilter: "blur(7px)",
                webkitBackdropFilter: "blur(7px)",
                position: "absolute",
                display: "block",
                borderRadius: "5px",
                boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
                transform: `translate(${position.x}px, ${position.y}px)`,
                px: "8px",
            }}
        >
            <Box
                className="terminal-content"
                ref={reff}
                sx={{ color: "aliceblue" }}
            >
                <Typography
                    component={"pre"}
                >{`------------- ${today.toLocaleString()} -------------`}</Typography>
                <Typography component={"pre"}>© 2023 abderox</Typography>
                <Typography component={"pre"}>
                    Developed by :
                    <a
                        style={{ color: "skyblue", textDecoration: "none" }}
                        href={"https://github.com/abderox"}
                    >
                        {" "}
                        {`https://github.com/abderox`}
                    </a>
                </Typography>
                <Typography component={"pre"}>Version : 1.1.0</Typography>
                <Typography component={"pre"}>
                    Current user : {username ? username : "Guest"}
                </Typography>
                <div>
                    {message !== "" && <pre>{message}</pre>}
                    <pre>{`Welcome to ${title} ! Type "help" to see the list of commands.\n`}</pre>
                    {outputValue.includes("%%%%% ") &&
                        outputValue.split("%%%%% ").map((item, index) => {
                            return (
                                item.split("************")?.at(0) && (
                                    <React.Fragment key={index}>
                                        <pre>
                                            <span
                                                style={{
                                                    color: "lime",
                                                    fontWeight: "bold",
                                                }}
                                            >{`${initialCommand}`}</span>
                                            <span
                                                style={{ color: "white" }}
                                            >{`${
                                                item
                                                    .split("************")
                                                    ?.at(0) ?? ""
                                            }`}</span>
                                        </pre>
                                        <pre>
                                            {item
                                                .split("************")
                                                ?.at(1) ?? ""}
                                        </pre>
                                    </React.Fragment>
                                )
                            );
                        })}
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <div
                        style={{
                            color: "lime",
                            fontWeight: "bold",
                            marginRight: "5px",
                        }}
                    >
                        {initialCommand}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={inputValue}
                            style={{
                                border: "none",
                                outline: "none",
                                backgroundColor: "transparent",
                                color: "white",
                                width: "100%",
                                caretColor: "white",
                                fontSize: "1rem",
                                padding: "0px",
                                margin: "0px",
                                fontFamily: "monospace",
                            }}
                            onChange={handleInputChange}
                            onKeyDown={handleEnterKeyPress}
                            autoFocus
                        />
                    </div>
                </div>
            </Box>
        </Box>
    );
};

export default Terminal;
