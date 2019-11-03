import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
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
    }
}));

const Deposit = (props) => {
    console.log(props)
    const classes = useStyles();

    // Manages the deposit flow using step system.
    const [step, setStep] = React.useState(1)
    const nextStep = () => {
        setStep(step + 1)
    };

    const getPorts = () => {
        // window.ipcRenderer.once('portList', (event, arg) => {
        //     if (arg.length > 0) {
        //         setValues({ ...values, portOptions: arg })
        //     } else {
        //         console.log("No scanner connected.")
        //     }
        // })
        // window.ipcRenderer.send('getPorts', 'portsPlz')
    };

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Make a Remote Deposit
        </Typography>
                <hr></hr>
                {step === 1 ? <div>
                    <Typography className={classes.subTitle} color="textSecondary" gutterBottom>
                        Step 1</Typography>
                    <p>Use the Accubanker S6500 to count your bills. Press Acknowledge once the count is complete.</p>
                    <Button onClick={nextStep}>Acknowledge</Button>
                </div> : null}
                {step === 2 ? <div>
                    <Typography className={classes.subTitle} color="textSecondary" gutterBottom>
                        Step 2</Typography>
                    <p>Press the "Show" button on the S6500 until the Serial Number Report is visible.</p>
                    <Button onClick={nextStep}>Acknowledge</Button>
                </div> : null}
            </CardContent>
        </Card>
    )
}

export default Deposit;