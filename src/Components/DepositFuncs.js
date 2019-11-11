// Checks the DB to make sure bills are unique.
const checkDuplicates = async (bills, firestore) => {
    let db = firestore
    const billArray = bills.map(async bill => {
        let docRef = db.collection('submittedBills').doc(bill.serial);
        const duplicate = await docRef.get().then(doc => {
            return doc.exists ? true : false
        })
        bill.duplicate = duplicate
        return bill
    });
    const sorted = await Promise.all(billArray);
    let uniques = sorted.filter(bill => bill.duplicate === false);
    let duplicates = sorted.filter(bill => bill.duplicate === true);
    let sortedBills = { duplicates, uniques }

    return sortedBills;
};

const validateDeposit = (billTotal, coinTotal, coins) => {
    // Check to make sure coins are less than 200 each.
    let validCount = Object.values(coins).every(coin => coin <= 200);
    // Check if value of bills greater than coins.
    let validAmount = billTotal > coinTotal

    return validCount && validAmount

}

// Adds deposit info to the customer deposit. 
const submitDeposit = async (billTotal, coinTotal, sortedBills, coins, company, email, location, firestore) => {
    let db = firestore;
    let total = (parseFloat(billTotal) + parseFloat(coinTotal)).toFixed(2)
    let data = {
        amount: parseFloat(total),
        company: company,
        email: email,
        location: location,
        status: "submitted",
        time: new Date(),
        pennies: coins.pennies,
        nickels: coins.nickels,
        dimes: coins.dimes,
        quarters: coins.quarters,
        ones: sortedBills.ones,
        twos: sortedBills.twos,
        fives: sortedBills.fives,
        tens: sortedBills.tens,
        twenties: sortedBills.twenties,
        fifties: sortedBills.fifties,
        hundreds: sortedBills.hundreds
    };
    let docRef = db.collection(company).doc(location).collection('deposits');
    let message = await docRef.add(data).then(() => {
        return total;
    }).catch(err => err)

    return message
}

// Adds bills to the submitted bill database.
const addBills = async (bills, company, firestore) => {
    let db = firestore;
    let batch = db.batch()
    for (let bill of bills) {
        let data = {
            company: company,
            denomination: bill.denomination,
            serial: bill.serial,
            time: new Date()
        }
        let docRef = db.collection('submittedBills').doc(bill.serial);
        batch.set(docRef, { data });
    }
    let message = await batch.commit().then(() => {
        return true
    }).catch(err => err)

    return message;

}

const DepositFuncs = {
    checkDuplicates: checkDuplicates,
    validateDeposit: validateDeposit,
    addBills: addBills,
    submitDeposit: submitDeposit
}

export default DepositFuncs;