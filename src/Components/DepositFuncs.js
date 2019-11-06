

const checkBills = (bills) => {
    console.log(bills)
};

const submitTran = async (bills, firebase) => {
    let db = firebase.firestore()
    let submittedBills = []
    db.collection('submittedBills').get().then((snap) => {
        snap.forEach((doc) => {
            submittedBills.push(doc.data())
        })
    })
    console.log(submittedBills);
}

module.exports = {
    checkBills: checkBills,
    submitTran: submitTran
}