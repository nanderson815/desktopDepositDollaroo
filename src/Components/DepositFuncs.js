

const checkBills = (bills, db) => {
    let duplicates = [];
    let unique = [];
    bills.forEach((bill) => {
        let docRef = db.collection('submittedBills').doc(bill.serial);
        docRef.get().then((doc) => {
            if (doc.exists) {
                duplicates.push(bill);
            } else {
                unique.push(bill)
            }
        })
    })
    return {
        unique: unique,
        duplicates: duplicates
    }
};

const submitTran = async (bills, firebase) => {
    let db = firebase.firestore()
    let sortedBills = await checkBills(bills, db);
    console.log(sortedBills);
}

module.exports = {
    submitTran: submitTran
}