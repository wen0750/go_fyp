import React, { useMemo, useState } from "react";
import styled from "styled-components";
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
import { useTable } from "react-table";
import { DraggableTableRow } from "./DraggableTableRow";
import { StaticTableRow } from "./StaticTableRow";

export function Table({ columns, data, setData }) {
    const Table = styled.table`
        tbody tr td:first-child {
            width: 4em;
            min-width: 1em;
            max-width: 8em;
            word-break: break-all;
        }
    `;
    const [activeId, setActiveId] = useState();
    const items = useMemo(() => data?.map(({ id }) => id), [data]);
    // const items = useMemo(() => );
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
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            setData(arrayMove(data, oldIndex, newIndex));
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
            <Table {...getTableProps()}>
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
            </Table>
            <DragOverlay>
                {activeId && (
                    <Table style={{ width: "100%" }}>
                        <tbody>
                            <StaticTableRow row={selectedRow} />
                        </tbody>
                    </Table>
                )}
            </DragOverlay>
        </DndContext>
    );
}
