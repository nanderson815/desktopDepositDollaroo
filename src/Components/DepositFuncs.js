

// const checkBills = (bills, db) => {
//     let duplicates = [];
//     let unique = [];

//     for (const bill of bills) {
//         let docRef = db.collection('submittedBills').doc(bill.serial);
//         docRef.get().then((doc) => {
//             if (doc.exists) {
//                 duplicates.push(bill);
//             } else {
//                 unique.push(bill)
//             }
//         })
//     }
//     return sorted;
// };

const checkDuplicates = async (bills, firebase) => {
    let db = firebase.firestore()
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
}

module.exports = {
    checkDuplicates: checkDuplicates
}