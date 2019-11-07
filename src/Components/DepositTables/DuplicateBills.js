import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 300,
        width: "100%"
    },
}));


export default function DuplicateBills(props) {
    const classes = useStyles();
    let rows = props.deposit.duplicates

    return (
        <Table className={classes.table} size="small" aria-label="caption table">
            <TableHead>
                <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell align="right">Denomination</TableCell>
                    <TableCell align="right">Serial Number</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row">
                            {row.order}
                        </TableCell>
                        <TableCell align="right">{row.denomination}</TableCell>
                        <TableCell align="right">{row.serial}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
