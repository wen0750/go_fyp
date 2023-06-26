import React, { useState } from "react";

import {
    Children,
    SidebarContainer,
    SidebarWrapper,
    SidebarLogoWrapper,
    SidebarLogo,
    SidebarBrand,
    SidebarToggler,
} from "./SidebarStyles";
import BrandLogo from "./BrandLogo.svg";
import { DehazeRoundedIcon } from "../sidebar_icon";

import { SidebarItems } from "../sidebar_core.jsx";

const MOBILE_VIEW = window.innerWidth < 468;

export default function Sidebar({ children }) {
    const [displaySidebar, setDisplaySidebar] = useState(!MOBILE_VIEW);

    const handleSidebarDisplay = (e) => {
        e.preventDefault();
        if (window.innerWidth > 468) {
            setDisplaySidebar(!displaySidebar);
        } else {
            setDisplaySidebar(false);
        }
    };

    return (
        <React.Fragment>
            <SidebarContainer displaySidebar={displaySidebar}>
                <SidebarWrapper>
                    <SidebarLogoWrapper displaySidebar={displaySidebar}>
                        <SidebarLogo href="#">
                            <span className="app-brand-logo demo">
                                <img src={BrandLogo} alt="Brand logo" />
                            </span>
                            <SidebarBrand
                                displaySidebar={displaySidebar}
                                className="app__brand__text"
                            >
                                Frest
                            </SidebarBrand>
                        </SidebarLogo>
                        <SidebarToggler
                            displaySidebar={displaySidebar}
                            onClick={handleSidebarDisplay}
                        >
                            <DehazeRoundedIcon />
                        </SidebarToggler>
                    </SidebarLogoWrapper>
                    <SidebarItems displaySidebar={displaySidebar} />
                </SidebarWrapper>
            </SidebarContainer>
            <Children displaySidebar={displaySidebar}>{children}</Children>
        </React.Fragment>
    );
}
