import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DepositDetailTable from './DepositTables/DepositDetail';
import DepositTotals from './DepositTables/DepositTotals';
import DuplicateBills from './DepositTables/DuplicateBills';
import DepositSlip from './DepositTables/DepositSlip';
import { Grid } from '@material-ui/core';
import DepositFuncs from './DepositFuncs';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    card: {
        minWidth: 500,
        maxWidth: 300,
        margin: "5px 0px"
    },
    formControl: {
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontWeight: "strong"
    },
    subTitle: {
        fontSize: 14
    },
    boldTitle: {
        fontSize: 14,
        color: "black"
    },
    centerText: {
        textAlign: "center"
    },
    button: {
        margin: "10px 5px 0px 5px"
    }
}));

let headerCount = 0;


const Deposit = (props) => {
    const classes = useStyles();

    // Manages the deposit flow using step system.
    const [step, setStep] = React.useState(1)
    const nextStep = () => {
        setStep(step + 1)
    };
    console.log(step)

    // Opens the port. Required.
    const openPort = () => {
        window.ipcRenderer.once('openPort', (event, arg) => {
            console.log(arg)
            setStep(step + 1)
        })
        window.ipcRenderer.send('openPort', props.port)
    };

    const [bills, setBills] = React.useState([]);

    const clearState = () => {
        setBills([]);
    };

    const [deposit, setDeposit] = React.useState([]);

    const submitFunc = async () => {
        let depositBills = await DepositFuncs.checkDuplicates(bills, props.firebase);
        nextStep()
        setDeposit(depositBills);
    }

    // Adds and removes listener on Re-render. Critial to remove.
    useEffect(() => {
        window.ipcRenderer.on('data', (event, message) => {
            // Resets count to avoid passing in text data.
            if (message === "AccuBANKER Station  S6500") {
                headerCount = 0;
                setBills([]);
            }
            headerCount++;
            // First five lines are not realted to bills.
            if (headerCount > 5) {
                let messageArr = message.split(/\s+/);
                messageArr.pop();
                messageArr.shift();
                let billObj = {
                    order: messageArr[0],
                    denomination: messageArr[1],
                    serial: messageArr[2]
                }
                if (!bills.some(bill => bill.serial === billObj.serial)) {
                    let messages = bills.slice();
                    messages.push(billObj);
                    setBills(messages);
                }
            }
        });
        return () => {
            window.ipcRenderer.removeAllListeners('data')
        }
    }, [bills])

    const resetState = () => {
        setStep(1);
        setBills([]);
        setDeposit([]);
    }

    const renderDuplicates = () => {
        if (deposit.duplicates && deposit.duplicates.length > 0) {
            return <div>
                <p>Duplicate bills were found! These bills were already submitted to Dollaroo, and will not be included in the remote deposit.</p>
                <DuplicateBills deposit={deposit}></DuplicateBills>
                <hr></hr>
            </div>
        }

    }

    const renderUniques = () => {
        if (deposit.uniques && deposit.uniques.length > 0) {
            return <div>
                <p>Your remote deposit slip is below. Please review, manually enter coins, and press submit to complete the remote deposit.</p>}
                            <DepositSlip bills={deposit.uniques} company={props.company} firebase={props.firebase}></DepositSlip>
            </div>
        } else {
            return <div>
                <p>No unique bills were found.</p>
                <Button onClick={resetState}>Cancel Deposit</Button>
            </div>
        }
    }

    return (
        <Grid container className={classes.root} spacing={2}>
            {step < 3 ?
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Make a Remote Deposit
        </Typography>
                            <hr></hr>
                            {step === 1 ? <div>
                                <Typography className={classes.subTitle} color="textSecondary" gutterBottom>
                                    Step 1</Typography>
                                <p>Make sure the S6500 is on "Mix" mode. Select Acknowledge and being counting.</p>
                                <Button onClick={openPort}>Acknowledge</Button>
                            </div> : null}
                            {step === 2 ? <div>
                                <Typography className={classes.subTitle} color="textSecondary" gutterBottom>
                                    Step 2</Typography>
                                <p>Press the "Start" button on the S6500 once you are ready to count. Data will populate below.</p>
                                <div className={classes.centerText}>
                                    <DepositDetailTable bills={bills}></DepositDetailTable>
                                    <Button className={classes.button} disabled={bills.length < 1} variant="contained" color="primary" onClick={submitFunc}>Validate</Button>
                                    <Button className={classes.button} disabled={bills.length < 1} variant="contained" color="primary" onClick={clearState}>Clear</Button>
                                </div>
                            </div> : null}

                        </CardContent>
                    </Card>
                </Grid>
                : null}
            {step === 2 ?
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <DepositTotals bills={bills}></DepositTotals>
                        </CardContent>
                    </Card>
                </Grid>
                : null
            }
            {step === 3 ?
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <div>
                                {renderDuplicates()}
                            </div>
                            <div>
                                {renderUniques()}
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
                : null}
        </Grid>
    )
}

export default Deposit;