/* eslint-disable eqeqeq */
import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    table: {
        width: 200,
    },
}));


const DepositTotals = (props) => {
    const classes = useStyles()

    let ones = props.bills.filter(x => x.denomination == 1).length;
    let fives = props.bills.filter(x => x.denomination == 5).length;
    let tens = props.bills.filter(x => x.denomination == 10).length;
    let twenties = props.bills.filter(x => x.denomination == 20).length;
    let fifties = props.bills.filter(x => x.denomination == 50).length;
    let hundreds = props.bills.filter(x => x.denomination == 100).length;
    let total = (ones) + (fives * 5) + (tens * 10) + (twenties * 20) + (fifties * 50) + (hundreds * 100);

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Denomination</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Ones</TableCell>
                    <TableCell>{ones}</TableCell>
                    <TableCell>${ones * 1}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Fives</TableCell>
                    <TableCell>{fives}</TableCell>
                    <TableCell>${fives * 5}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Tens</TableCell>
                    <TableCell>{tens}</TableCell>
                    <TableCell>${tens * 10}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Twenties</TableCell>
                    <TableCell>{twenties}</TableCell>
                    <TableCell>${twenties * 20}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Fifties</TableCell>
                    <TableCell>{fifties}</TableCell>
                    <TableCell>${fifties * 50}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Hundreds</TableCell>
                    <TableCell>{hundreds}</TableCell>
                    <TableCell>${hundreds * 100}</TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>Grand Total</TableCell>
                    <TableCell>{props.bills.length}</TableCell>
                    <TableCell>${total}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default DepositTotals