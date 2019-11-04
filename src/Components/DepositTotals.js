import React from 'react';
import { Table, TableHead, TableRow, TableCell } from '@material-ui/core';

const DepositTotals = (props) => {
    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Denomination</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Total</TableCell>
                </TableRow>
            </TableHead>
        </Table>
    )
}

export default DepositTotals