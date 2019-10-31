import React from 'react';
import { withFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';



const Dashboard = (props) => {
    const auth = useSelector(state => state.firebase.auth)
    console.log(auth);

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
                            <h1>Dashboard</h1>
                            <Button onClick={logout} variant="contained" color="primary">Logout</Button>
                        </div>
            }

        </div>
    )
}

export default withFirebase(Dashboard)