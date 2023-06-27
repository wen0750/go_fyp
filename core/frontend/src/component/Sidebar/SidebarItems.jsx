import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ItemsList,
    ItemContainer,
    ItemWrapper,
    ItemName,
} from "./SidebarStyles";

import { dummyData } from "../sidebar_core";

const SidebarItems = ({ displaySidebar }) => {
    const [activeItem, setActiveItem] = useState(0);

    return (
        <ItemsList>
            {dummyData.map((itemData, index) => (
                <ItemContainer
                    key={index}
                    onClick={() => setActiveItem(itemData.id)}
                    className={itemData.id === activeItem ? "active" : ""}
                >
                    <Link
                        to={itemData.path}
                        style={{ padding: "0.5rem 0.25rem", width: "100%" }}
                    >
                        <ItemWrapper>
                            {itemData.icon}
                            <ItemName displaySidebar={displaySidebar}>
                                {itemData.name}
                            </ItemName>
                        </ItemWrapper>
                    </Link>
                </ItemContainer>
            ))}
        </ItemsList>
    );
};

export default SidebarItems;
