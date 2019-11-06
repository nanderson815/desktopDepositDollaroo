import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DepositDetailTable from './DepositTables/DepositDetail';
import DepositTotals from './DepositTables/DepositTotals';
import { Grid } from '@material-ui/core';

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

    // Adds and removes listener on Re-render. Critial to remove.
    useEffect(() => {
        window.ipcRenderer.on('data', (event, message) => {
            // Resets count to avoid passing in text data.
            if (message === "AccuBANKER Station  S6500") {
                headerCount = 0;
            }
            console.log(message);
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

    return (
        <Grid container className={classes.root} spacing={2}>
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
                                <Button className={classes.button} variant="contained" color="primary">Submit</Button>
                                <Button className={classes.button} variant="contained" color="primary" onClick={clearState}>Clear</Button>
                            </div>
                        </div> : null}
                    </CardContent>
                </Card>
            </Grid>
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
        </Grid>
    )
}

export default Deposit;