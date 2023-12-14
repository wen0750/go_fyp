import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const DraggingRow = styled.td`
    background: rgba(127, 207, 250, 0.3);
`;
const TableData = styled.td`
    background: white;
    &:first-of-type {
        min-width: 20ch;
    }
`;
const HandleWrapper = styled.div`
    height: 1rem;
    vertical-align: bottom;
    display: inline-block;
    margin-right: 0.5rem;
    svg {
        width: 100%;
        height: 100%;
    }
    cursor: ${({ isDragging }) => (isDragging ? "grabbing" : "grab")};
`;
const StyledStaticData = styled.td`
    background: white;
    &:first-of-type {
        min-width: 20ch;
    }
`;
const DraggableTableRow = ({ row }) => {
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
                    if (i === 0) {
                        return (
                            <TableData {...cell.getCellProps()}>
                                <DragHandle {...attributes} {...listeners} />
                                <span>{cell.render("Cell")}</span>
                            </TableData>
                        );
                    }
                    return (
                        <TableData {...cell.getCellProps()}>
                            {cell.render("Cell")}
                        </TableData>
                    );
                })
            )}
        </tr>
    );
};

const DragHandle = (props) => {
    return (
        <HandleWrapper {...props}>
            <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="grip-vertical"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
            >
                <path
                    fill="currentColor"
                    d="M96 32H32C14.33 32 0 46.33 0 64v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM288 32h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"
                ></path>
            </svg>
        </HandleWrapper>
    );
};

const StyledStaticTableRow = styled.tr`
    box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px,
        rgb(0 0 0 / 30%) 0px 10px 10px -5px;
    outline: #3e1eb3 solid 1px;
`;

const StaticTableRow = ({ row }) => {
    return (
        <StyledStaticTableRow {...row.getRowProps()}>
            {row.cells.map((cell, i) => {
                if (i === 0) {
                    return (
                        <StyledStaticData {...cell.getCellProps()}>
                            <DragHandle isDragging />
                            <span>{cell.render("Cell")}</span>
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

export default function DnD_Table({ columns, data, setData }) {
    const [activeId, setActiveId] = useState();
    const items = useMemo(() => data?.map(({ id }) => id), [data]);
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns,
            data,
        });
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setData((data) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    const selectedRow = useMemo(() => {
        if (!activeId) {
            return null;
        }
        const row = rows.find(({ original }) => original.id === activeId);
        prepareRow(row);
        return row;
    }, [activeId, rows, prepareRow]);

    // Render the UI for your table
    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
        >
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <DraggableTableRow
                                    key={row.original.id}
                                    row={row}
                                />
                            );
                        })}
                    </SortableContext>
                </tbody>
            </table>
            <DragOverlay>
                {activeId && (
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <StaticTableRow row={selectedRow} />
                        </tbody>
                    </table>
                )}
            </DragOverlay>
        </DndContext>
    );
}
