// Rules define initial and final status based on transaction information
// Order of info fields defined below
// Rules are tried in the defined order, and the first to hit is applied
const statusRules = [

    // Amount is higher than 200€
    [
        [x => true, x => x >= 200, x => true, x => true, x => true],
        ['⏳', '✅'],
    ],

    // User profile is "Spider Man"
    [
        [x => true, x => true, x => x !== 'Peter Parker', x => true, x => x === 'Spiderman'],
        ['⏳', '❌', 'We all know you are not who you say you are. '],
    ],

    // User Profile is "Iron Man"
    [
        [x => true, x => x >= 1000000, x => true, x => true, x => x === 'Iron Man'],
        ['⏳', '❌', 'Suspicious payment. This seems to be too cheap for you. '],
    ],

    // User Profile is "Hulk"
    [
        [x => true, x => x >= true, x => true, x => true, x => x === 'Hulk'],
        ['⏳', '❌', 'We\'re sure you have no idea how to buy stuff.'],
    ],

    // User Profile is "Vicky"
    [
        [x => true, x => x >= true, x => true, x => true, x => x === 'Vicky'],
        ['⏳', '✅', 'Of course! And yes, these are not error details, these are SUCCESS DETAILS! And, for you, everythig is free!'],
    ],

    // User Profile is "Nemo"
    [
        [x => true, x => x >= true, x => true, x => true, x => x === 'Nemo'],
        ['⏳', '❌', 'Sorry, we\'re a bit racist in here.'],
    ],

];

const orderedFields = ['operation', 'amount', 'buyersName', 'orderIdentifier', 'userProfile'];

const calculateStatus = (info) => {
    for ([rule, result] of statusRules) {
        let found = true;

        for (let i = 0; i < orderedFields.length; i++) {
            const fieldValue = info[orderedFields[i]];
            const fieldRule = rule[i];

            if (!fieldRule(fieldValue)) {
                found = false;
                break;
            }
        }

        if (found) {
            return result;
        }
    }

    // If all rules fail, let's be nice
    return ['✅', '✅', null];
}

module.exports = {
    calculateStatus,
};
