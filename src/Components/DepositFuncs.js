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

const validateDeposit = (billTotal, cointTotal, coins) => {
    // Check to make sure coins are less than 200 each.
    let validCount = Object.values(coins).every(coin => coin <= 200);
    // Check if value of bills greater than coins.
    let validAmount = billTotal > cointTotal

    return validCount && validAmount

}

const addBills = async (bills, company, firestore) => {
    let db = firestore
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
        return "Batch written with no errors!"
    }).catch(err => err)

    return message;

}

module.exports = {
    checkDuplicates: checkDuplicates,
    validateDeposit: validateDeposit,
    addBills: addBills
}