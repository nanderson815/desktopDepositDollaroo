import React from 'react';
import { Button } from '@material-ui/core';


const DepositConfirmation = (props) => {
    return (
        <div>
            <p>Deposit complete. You deposited ${props.amount}</p>
            <Button onClick={props.reset}>Complete</Button>
        </div>
    )
}

export default DepositConfirmation;