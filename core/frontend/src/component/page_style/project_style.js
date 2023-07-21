import styled from "styled-components";

// Children Component

export const ProjectHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const MiniTitle = styled.div`
    border-bottom: dotted;
    border-color: lightsteelblue;
    border-width: 1px;
`;

export const UnderLineMiniTitle = styled.div`
    border-bottom: outset;
    border-color: #fff;
    border-width: 1.99px;
    padding-bottom: 8px;
    font-size: bold;
    font-weight: 700;
`;

export const CustScanDetails = styled.div`
    column-count: 2;
    display: block;
    margin-bottom: 15px;
`;

export const ThreatsDetails = styled.div`
    column-count: 2;
    display: block;
    margin-bottom: 15px;
`;