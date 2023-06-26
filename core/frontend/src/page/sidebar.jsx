import { Routes, Route } from "react-router-dom";
import { DynamicItem, Sidebar, dummyData } from "../component/sidebar_core";
import "../assets/css/sidebar_style.css";

function App() {
    return (
        <div id="main">
            <Sidebar>
                <Routes>
                    <Route path="/" element={<DynamicItem page="homepage" />} />
                    {dummyData &&
                        dummyData.map((item, index) => (
                            <Route
                                key={index}
                                path={item.path}
                                displayName={item.name}
                                element={<DynamicItem page={item.name} />}
                            />
                        ))}
                </Routes>
            </Sidebar>
        </div>
    );
}

export default App;
