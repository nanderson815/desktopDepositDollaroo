import React, { useEffect } from 'react';
import { withFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { Container } from '@material-ui/core';
import ConnectScanner from './ConnectScanner';
import Deposit from './Deposit';
const { ipcRenderer } = window.require("electron");


const Dashboard = (props) => {
    const auth = useSelector(state => state.firebase.auth)
    const [values, setValues] = React.useState({
        company: '',
        location: '',
        name: '',
        port: '',
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
                    let email = idTokenResult.claims.email
                    setValues({ company, location, name, email })
                })
                .catch(err => console.log(err));
        }
    }, [auth, props.firebase])

    useEffect(() => {
        if (!values.port) {
            ipcRenderer.once('portStatus', (event, arg) => {
                if (arg !== null) {
                    setValues({ ...values, port: arg })
                } else {
                    console.log("No port connected.")
                }
            })
            ipcRenderer.send('checkPortStatus', 'portsPlz')
        }
    })

    const logout = () => {
        props.firebase.logout()
        setValues({ company: '', location: '', name: '', port: '' })
    }

    return (
        <Container>
            {
                !isLoaded(auth)
                    ? <span>Loading...</span>
                    : isEmpty(auth)
                        ? <Redirect to={{ pathname: "/" }} />
                        : <div>
                            <h1>{values.company}</h1>
                            {values.port ? <div>
                                <p>{`Connected to ${values.port}`}</p>
                                <Deposit
                                    firebase={props.firebase}
                                    company={values.company}
                                    location={values.location}
                                    email={values.email}
                                    port={values.port}></Deposit>
                            </div>
                                : null}
                            {!values.port ? <ConnectScanner port={values.port} select={handleChange}></ConnectScanner> : null}
                            <Button onClick={logout} variant="contained" color="primary">Logout</Button>
                        </div>
            }

        </Container>
    )
}

export default withFirebase(Dashboard)