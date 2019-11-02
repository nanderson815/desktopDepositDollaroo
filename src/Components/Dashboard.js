import React, { useEffect } from 'react';
import { withFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { Redirect } from 'react-router-dom';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const Dashboard = (props) => {
    const classes = useStyles();
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);
    const auth = useSelector(state => state.firebase.auth)

    const [values, setValues] = React.useState({
        company: '',
        location: '',
        name: '',
        port: '',
        portOptions: []
    })

    const handleChange = event => {
        setValues({ ...values, port: event.target.value });
    };

    useEffect(() => {
        if (isLoaded(auth) && !isEmpty(auth)) {
            props.firebase.auth().currentUser.getIdTokenResult()
                .then((idTokenResult) => {
                    console.log(idTokenResult.claims)
                    let company = idTokenResult.claims.company
                    let location = idTokenResult.claims.location
                    let name = idTokenResult.claims.name
                    setValues({ company, location, name })
                })
                .catch(err => console.log(err));
        }
    }, [auth, props.firebase])

    const getPorts = () => {
        window.ipcRenderer.once('portList', (event, arg) => {
            if (arg.length > 0) {
                setValues({ ...values, portOptions: arg })
                console.log(values.portOptions)
            } else {
                console.log("No scanner connected.")
            }
        })
        window.ipcRenderer.send('getPorts', 'portsPlz')
    }


    const logout = () => {
        props.firebase.logout()
    }

    return (
        <div>
            {
                !isLoaded(auth)
                    ? <span>Loading...</span>
                    : isEmpty(auth)
                        ? <Redirect to={{ pathname: "/" }} />
                        : <div>
                            <h1>{values.company}</h1>
                            <Button variant="contained" color="primary">Make Deposit</Button>
                            <Button onClick={logout} variant="contained" color="primary">Logout</Button>
                            <Button onClick={getPorts} variant="contained" color="primary">Connect Scanner</Button>
                            {values.portOptions ?
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                                        Select Port</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        onChange={handleChange}
                                        labelWidth={labelWidth}
                                        value={values.port || ""}
                                    >
                                        {values.portOptions.map((port, index) => {
                                            return <MenuItem key={index} value={port}>{port}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                : null
                            }
                        </div>
            }

        </div>
    )
}

export default withFirebase(Dashboard)