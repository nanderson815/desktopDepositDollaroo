import React, { useEffect } from 'react';
import { withFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';

const Dashboard = (props) => {
    const auth = useSelector(state => state.firebase.auth)

    const [values, setValues] = React.useState({
        company: '',
        location: '',
        name: '',
        port: '',
        portOptions: ''
    })

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
            console.log(arg) // prints "pong"
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
                            <Button onClick={getPorts} variant="contained" color="primary">Get Ports</Button>
                        </div>
            }

        </div>
    )
}

export default withFirebase(Dashboard)