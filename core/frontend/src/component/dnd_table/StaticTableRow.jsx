import React from "react";
import { DragHandle } from "./DragHandle";
import styled from "styled-components";

const StyledStaticData = styled.td`
    background: white;
    min-width: 200px;
    &:first-of-type {
        min-width: 20ch;
    }
`;

const StyledStaticTableRow = styled.tr`
    box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px,
        rgb(0 0 0 / 30%) 0px 10px 10px -5px;
    outline: #3e1eb3 solid 1px;
`;

export const StaticTableRow = ({ row }) => {
    return (
        <StyledStaticTableRow {...row.getRowProps()}>
            {row.cells.map((cell, i) => {
                if (i === 0) {
                    return (
                        <StyledStaticData {...cell.getCellProps()}>
                            <DragHandle isDragging />
                            <input
                                type="checkbox"
                                defaultChecked={cell.value}
                            />
                        </StyledStaticData>
                    );
                }
                return (
                    <StyledStaticData {...cell.getCellProps()}>
                        {cell.render("Cell")}
                    </StyledStaticData>
                );
            })}
        </StyledStaticTableRow>
    );
};
