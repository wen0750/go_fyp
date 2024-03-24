import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { DynamicItem, Sidebar, dummyData } from "../component/sidebar_core";
import "../assets/css/sidebar_style.css";

function App() {
    return (
        <div id="main">
            <Sidebar>
                <Routes>
                    <Route path="/" element={<DynamicItem page="folder" />} />
                    <Route path={"/folder/:fid"} element={<DynamicItem page="folder" />} />
                    <Route path={"/project/:pid"} element={<DynamicItem page="project" />} />
                    <Route path={"/editor/:eid"} element={<DynamicItem page="editor" />} />
                    <Route path={"/terminal/:id"} element={<DynamicItem page="terminal" />} />
                </Routes>
            </Sidebar>
        </div>
    );
}

export default App;
