import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { DynamicItem, Sidebar, dummyData } from "../component/sidebar_core";
import "../assets/css/sidebar_style.css";

function App() {
    return (
        <div id="main">
            <Sidebar>
                <Routes>
                    <Route
                        path="/"
                        element={<DynamicItem page="" path="folder" />}
                    />
                    {dummyData &&
                        dummyData.map((item, index) => (
                            <Route
                                key={index}
                                path={item.path + "/" + item.id}
                                displayName={item.name}
                                element={
                                    <DynamicItem
                                        page={item.path}
                                        fid={item.id}
                                    />
                                }
                            />
                        ))}
                </Routes>
            </Sidebar>
        </div>
    );
}

export default App;
