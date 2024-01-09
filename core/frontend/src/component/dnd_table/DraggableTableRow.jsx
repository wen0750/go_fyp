import React from "react";
import styled from "styled-components";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Checkbox from "@mui/material/Checkbox";
import Input from "@mui/material/Input";

import { DragHandle } from "./DragHandle";

const DraggingRow = styled.td`
    background: rgba(127, 207, 250, 0.3);
`;

const TableData = styled.td`
    background: white;
    min-width: 200px;
    &:first-of-type {
        min-width: 20ch;
    }
`;

export const DraggableTableRow = ({ row, dataInput }) => {
    const {
        attributes,
        listeners,
        transform,
        transition,
        setNodeRef,
        isDragging,
    } = useSortable({
        id: row.original.id,
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    };

    return (
        <tr ref={setNodeRef} style={style} {...row.getRowProps()}>
            {isDragging ? (
                <DraggingRow colSpan={row.cells.length}>&nbsp;</DraggingRow>
            ) : (
                row.cells.map((cell, i) => {
                    console.log(row.id);
                    if (i === 0) {
                        return (
                            <TableData {...cell.getCellProps()}>
                                <DragHandle {...attributes} {...listeners} />
                                <input
                                    type="checkbox"
                                    defaultChecked={cell.value}
                                    // onChange={(event) => setData(row.id, event)}
                                />
                            </TableData>
                        );
                    }
                    return (
                        <TableData {...cell.getCellProps()}>
                            <Input
                                value={cell.value}
                                onChange={(event) =>
                                    dataInput(
                                        row.id,
                                        cell.column.id,
                                        event.target.value
                                    )
                                }
                            />
                        </TableData>
                    );
                })
            )}
        </tr>
    );
};
