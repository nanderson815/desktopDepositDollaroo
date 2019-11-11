/* eslint-disable eqeqeq */
import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DepositFuncs from '../DepositFuncs';

const useStyles = makeStyles(theme => ({
    totalRow: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black"
    },
    textField: {
        width: 100,
    },
    centerText: {
        marginTop: 10,
        textAlign: "center"
    },
    errorText: {
        color: "red"
    }
}));


const DepositTotals = (props) => {
    const classes = useStyles()

    // Coin Data
    const [coins, setCoins] = React.useState({
        pennies: 0,
        nickels: 0,
        dimes: 0,
        quarters: 0
    });

    let coinTotal = ((coins.pennies * .01) + (coins.nickels * .05) + (coins.dimes * .1) + (coins.quarters * .25)).toFixed(2);

    // Error validation
    const [errorText, setErrorText] = React.useState({})

    const handleChange = event => {
        let num = parseInt(event.target.value)
        if (num < 0 || !num) {
            num = 0
        } else if (num > 200) {
            setErrorText({ ...errorText, [event.target.name]: '200 Coin Maximum.' });
        } else {
            setErrorText({ ...errorText, [event.target.name]: '' });
        }
        setCoins({ ...coins, [event.target.name]: num });
    }

    // Bills data.
    let ones = props.bills ? props.bills.filter(x => x.denomination == 1).length : 0;
    let twos = props.bills ? props.bills.filter(x => x.denomination == 2).length : 0;
    let fives = props.bills ? props.bills.filter(x => x.denomination == 5).length : 0;
    let tens = props.bills ? props.bills.filter(x => x.denomination == 10).length : 0;
    let twenties = props.bills ? props.bills.filter(x => x.denomination == 20).length : 0;
    let fifties = props.bills ? props.bills.filter(x => x.denomination == 50).length : 0;
    let hundreds = props.bills ? props.bills.filter(x => x.denomination == 100).length : 0;
    let sortedBills = {
        ones: ones,
        twos: twos,
        fives: fives,
        tens: tens,
        twenties: twenties,
        fifties: fifties,
        hundreds: hundreds
    };
    let billTotal = (ones) + (twos * 2) + (fives * 5) + (tens * 10) + (twenties * 20) + (fifties * 50) + (hundreds * 100);

    const handleSubmit = async () => {
        // 1. Validate deposit or throw error if issue.
        let valid = DepositFuncs.validateDeposit(billTotal, coinTotal, coins);
        console.log(valid);
        // 2. Add bills to database.
        if (valid) {
            let logged = await DepositFuncs.addBills(props.bills, props.company, props.firestore);
            console.log(logged);
            // 3. Add deposit to customer database.
            if (logged) {
                let total = await DepositFuncs.submitDeposit(billTotal, coinTotal, sortedBills, coins, props.company, props.email, props.location, props.firestore);
                if (total) {
                    props.completeDeposit(total);
                } else {
                    props.completeDeposit(0);
                }
            }
        } else {
            setErrorText({ ...errorText, submit: "Too many coins or coin value exceeds bill value." })
        }
    }

    return (
        <div>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Denomination</TableCell>
                        <TableCell>Count</TableCell>
                        <TableCell>Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Change */}
                    <TableRow>
                        <TableCell>Pennies</TableCell>
                        <TableCell><TextField
                            error={!!errorText.pennies}
                            helperText={errorText.pennies}
                            id="pennies"
                            name='pennies'
                            label="Pennies"
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={coins.pennies}
                            onChange={handleChange}
                            margin="dense"
                            variant="outlined"
                            min="0"
                        /></TableCell>
                        <TableCell>${(coins.pennies * .01).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Nickels</TableCell>
                        <TableCell><TextField
                            error={!!errorText.nickels}
                            helperText={errorText.nickels}
                            id="nickels"
                            name='nickels'
                            label="Nickels"
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="dense"
                            variant="outlined"
                            onChange={handleChange}
                            value={coins.nickels}
                        /></TableCell>
                        <TableCell>${(coins.nickels * .05).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Dimes</TableCell>
                        <TableCell><TextField
                            error={!!errorText.dimes}
                            helperText={errorText.dimes}
                            id="dimes"
                            name='dimes'
                            label="Dimes"
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="dense"
                            variant="outlined"
                            onChange={handleChange}
                            value={coins.dimes}
                        /></TableCell>
                        <TableCell>${(coins.dimes * .1).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Quarters</TableCell>
                        <TableCell><TextField
                            error={!!errorText.quarters}
                            helperText={errorText.quarters}
                            id="quarters"
                            name='quarters'
                            label="Quarters"
                            type="number"
                            className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="dense"
                            variant="outlined"
                            onChange={handleChange}
                            value={coins.quarters}
                        /></TableCell>
                        <TableCell>${(coins.quarters * .25).toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell className={classes.totalRow}>Total Coins</TableCell>
                        <TableCell className={classes.totalRow}>{coins.pennies + coins.nickels + coins.dimes + coins.quarters}</TableCell>
                        <TableCell className={classes.totalRow}>${coinTotal}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>


            {/* Bills */}
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
                        <TableCell className={classes.totalRow}>${billTotal}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className={classes.centerText}>
                <Button disabled={billTotal <= 0} onClick={handleSubmit} className={classes.button} variant="contained" color="primary">Submit</Button>
                <p className={classes.errorText}>{errorText.submit ? errorText.submit : null}</p>
            </div>
        </div>
    )
}

export default DepositTotals