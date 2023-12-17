import React from "react";
import styled from "styled-components";

// import makeData from "./makeData";
import { Table } from "./Table";

const Styles = styled.div`
    padding: 1rem;

    table {
        border-spacing: 0;
        border: 1px solid black;

        tr {
            :last-child {
                td {
                    border-bottom: 0;
                }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            border-right: 1px solid black;

            :last-child {
                border-right: 0;
            }
        }
    }
`;

function dnt_Table() {
    const columns = React.useMemo(
        () => [
            {
                Header: "Name",
                columns: [
                    {
                        Header: "First Name",
                        accessor: "firstName",
                    },
                    {
                        Header: "Last Name",
                        accessor: "lastName",
                    },
                ],
            },
        ],
        []
    );

    const dd_data = [
        {
            age: 9,
            firstName: "cork",
            id: "row-1",
            lastName: "wing",
            progress: 9,
            status: "single",
            subRows: undefined,
            visits: 16,
        },
        {
            age: 9,
            firstName: "sork",
            id: "rsow-1",
            lastName: "wsing",
            progress: 9,
            status: "ssingle",
            subRows: undefined,
            visits: 16,
        },
    ];

    const [data, setData] = React.useState(dd_data);
    return (
        <Styles>
            <Table columns={columns} data={data} setData={setData} />
        </Styles>
    );
}

export default dnt_Table;
