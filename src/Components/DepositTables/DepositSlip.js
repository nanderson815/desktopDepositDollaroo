/* eslint-disable eqeqeq */
import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    totalRow: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black"
    }
}));


const DepositTotals = (props) => {
    const classes = useStyles()

    let ones = props.bills ? props.bills.filter(x => x.denomination == 1).length : 0;
    let twos = props.bills ? props.bills.filter(x => x.denomination == 2).length : 0;
    let fives = props.bills ? props.bills.filter(x => x.denomination == 5).length : 0;
    let tens = props.bills ? props.bills.filter(x => x.denomination == 10).length : 0;
    let twenties = props.bills ? props.bills.filter(x => x.denomination == 20).length : 0;
    let fifties = props.bills ? props.bills.filter(x => x.denomination == 50).length : 0;
    let hundreds = props.bills ? props.bills.filter(x => x.denomination == 100).length : 0;
    let total = (ones) + (twos * 2) + (fives * 5) + (tens * 10) + (twenties * 20) + (fifties * 50) + (hundreds * 100);

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
                    <TableCell>Twos</TableCell>
                    <TableCell>{twos}</TableCell>
                    <TableCell>${twos * 2}</TableCell>
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
                    <TableCell className={classes.totalRow}>Total Bills</TableCell>
                    <TableCell className={classes.totalRow}>{props.bills ? props.bills.length : 0}</TableCell>
                    <TableCell className={classes.totalRow}>${total}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default DepositTotals