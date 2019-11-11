import React from 'react';
import { Button } from '@material-ui/core';


const DepositConfirmation = (props) => {
    return (
        <div>
            <p>Deposit complete! The following amount has been submitted to Dollaroo.</p>
            <p style={{ color: "green", fontWeight: "bold", fontSize: "16px", textAlign: 'center' }}> ${props.amount}</p>
            <Button variant="contained" color="primary" onClick={props.reset}>Complete</Button>
        </div >
    )
}

export default DepositConfirmation;