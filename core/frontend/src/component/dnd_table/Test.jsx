import React from "react";
import styled from "styled-components";

import { closestCenter, DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useSortable, arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { useTable } from "react-table";

import Checkbox from "@mui/material/Checkbox";
import Input from "@mui/material/Input";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default class Dnd_Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeId: null,
        };

        this.HandleWrapper = styled.div`
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

        this.StyledStaticData = styled.td`
            background: white;
            min-width: 200px;
            &:first-of-type {
                min-width: 20ch;
            }
        `;

        this.StyledStaticTableRow = styled.tr`
            box-shadow: rgb(0 0 0 / 10%) 0px 20px 25px -5px, rgb(0 0 0 / 30%) 0px 10px 10px -5px;
            outline: #3e1eb3 solid 1px;
        `;

        this.DraggingRow = styled.td`
            background: rgba(127, 207, 250, 0.3);
        `;

        this.TableData = styled.td`
            background: white;
            min-width: 200px;
            &:first-of-type {
                min-width: 20ch;
            }
        `;

        this.Table = styled.table`
            tbody tr td:first-child {
                width: 4em;
                min-width: 1em;
                max-width: 8em;
                word-break: break-all;
            }
        `;
    }

    handleDragStart = (event) => {
        this.setActiveId(event.active.id);
    };

    handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);
            this.props.setData(arrayMove(data, oldIndex, newIndex));
        }

        this.setActiveId(null);
    };
    handleDataInput = (id, key, targetValue) => {
        const sdata = data;
        sdata[id][key] = targetValue;
        this.props.setData(sdata);
    };

    handleDragCancel = () => {
        this.setActiveId(null);
    };

    setActiveId = (newValue) => {
        this.setState({ activeId: newValue });
    };

    DragHandle = (props) => {
        return (
            <this.HandleWrapper {...props}>
                <DragIndicatorIcon sx={{ fontSize: 40 }} />
            </this.HandleWrapper>
        );
    };

    StaticTableRow = ({ row }) => {
        return (
            <this.StyledStaticTableRow {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                    if (i === 0) {
                        return (
                            <this.StyledStaticData {...cell.getCellProps()}>
                                <DragHandle isDragging />
                                <input type="checkbox" defaultChecked={cell.value} />
                            </this.StyledStaticData>
                        );
                    }
                    return <this.StyledStaticData {...cell.getCellProps()}>{cell.render("Cell")}</this.StyledStaticData>;
                })}
            </this.StyledStaticTableRow>
        );
    };

    DraggableTableRow = ({ row, dataInput }) => {
        const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({
            id: row.original.id,
        });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition: transition,
        };

        return (
            <tr ref={setNodeRef} style={style} {...row.getRowProps()}>
                {isDragging ? (
                    <this.DraggingRow colSpan={row.cells.length}>&nbsp;</this.DraggingRow>
                ) : (
                    row.cells.map((cell, i) => {
                        console.log(row.id);
                        if (i === 0) {
                            return (
                                <this.TableData {...cell.getCellProps()}>
                                    <this.DragHandle {...attributes} {...listeners} />
                                    <input
                                        type="checkbox"
                                        defaultChecked={cell.value}
                                        // onChange={(event) => this.props.setData(row.id, event)}
                                    />
                                </this.TableData>
                            );
                        }
                        return (
                            <this.TableData {...cell.getCellProps()}>
                                <Input value={cell.value} onChange={(event) => dataInput(row.id, cell.column.id, event.target.value)} />
                            </this.TableData>
                        );
                    })
                )}
            </tr>
        );
    };

    componentDidMount() {
        this.items = this.props.data?.map(({ id }) => id);
    }

    componentDidUpdate() {
        if (this.props.data !== prevProps.data) {
            this.items = this.props.data?.map(({ id }) => id);
        }
    }

    render() {
        const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(this.props.columns, this.props.data);
        const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

        const selectedRow = useMemo(() => {
            if (!this.state.activeId) {
                return null;
            }
            const row = rows.find(({ original }) => original.id === this.state.activeId);
            prepareRow(row);
            return row;
        }, [this.state.activeId, rows, prepareRow]);

        return (
            <DndContext
                sensors={sensors}
                onDragEnd={this.handleDragEnd}
                onDragStart={this.handleDragStart}
                onDragCancel={this.handleDragCancel}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
            >
                <this.Table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                            {rows.map((row, i) => {
                                prepareRow(row);
                                return <this.DraggableTableRow key={row.original.id} row={row} dataInput={this.handleDataInput} />;
                            })}
                        </SortableContext>
                    </tbody>
                </this.Table>
                <DragOverlay>
                    {this.state.activeId && (
                        <this.Table style={{ width: "100%" }}>
                            <tbody>
                                <this.StaticTableRow row={selectedRow} />
                            </tbody>
                        </this.Table>
                    )}
                </DragOverlay>
            </DndContext>
        );
    }
}
