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
const { ipcRenderer } = window.require("electron");


const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
        maxWidth: 300,
        margin: "5px 0px"
    },
    formControl: {
        width: "100%",
    },
    title: {
        fontSize: 16,
    },
    centerText: {
        textAlign: "center"
    }
}));

const ConnectScanner = (props) => {
    console.log(props)
    const classes = useStyles();

    const [values, setValues] = React.useState({
        portOptions: []
    })

    const getPorts = () => {
        ipcRenderer.once('portList', (event, arg) => {
            if (arg.length > 0) {
                setValues({ ...values, portOptions: arg })
            } else {
                console.log("No scanner connected.")
            }
        })
        ipcRenderer.send('getPorts', 'portsPlz')
    };

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Connect your Scanner
        </Typography>
                {values.portOptions.length !== 0 ?
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">
                            Select Port</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            onChange={props.select}
                            value={props.port || ""}
                        >
                            {values.portOptions.map((port, index) => {
                                return <MenuItem key={index} value={port}>{port}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    : <div className={classes.centerText}>
                        <Button className={classes.formControl} onClick={getPorts} variant="contained" color="primary">Connect</Button>
                    </div>
                }
            </CardContent>
        </Card>
    )
}

export default ConnectScanner;