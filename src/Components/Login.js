import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { withFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { Paper, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    root: {
        padding: theme.spacing(3, 2),
        maxWidth: 500
    },
    button: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400,
    },
    margin: {
        marginTop: theme.spacing(2),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
}));

const Login = (props) => {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        showPassword: false,
        error: ''
    });

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const auth = useSelector(state => state.firebase.auth)
    const firebase = props.firebase;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (values.email && values.password) {
            return firebase.login({
                email: values.email,
                password: values.password
            })
                .catch((err) => {
                    setValues({ ...values, error: err.message })
                })
        }
    }

    return (
        <Container>
            {
                !isLoaded(auth)
                    ? <span>Loading...</span>
                    : isEmpty(auth)
                        ? <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center"
                            style={{ minHeight: '75vh' }}>
                            <Paper className={classes.root}>
                                <form className={classes.container} noValidate autoComplete="off">
                                    <h2>Login</h2>
                                    <TextField
                                        id="email-textarea"
                                        label="Email"
                                        placeholder="Email"
                                        value={values.email}
                                        onChange={handleChange('email')}
                                        multiline
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                    />
                                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={values.showPassword ? 'text' : 'password'}
                                            value={values.password}
                                            onChange={handleChange('password')}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            labelWidth={70}
                                        />
                                    </FormControl>
                                    <Button type="submit" onClick={handleSubmit} variant="contained" color="primary" className={classes.button}>
                                        Submit
                            </Button>
                                    <p id="error">{values.error}</p>
                                </form>
                            </Paper>
                        </Grid>
                        : <Redirect to={{ pathname: "/dashboard" }} />
            }

        </Container>
    )
}

export default withFirebase(Login);