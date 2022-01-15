// Rules define initial and final status based on transaction information
// Order of info fields defined below
// Rules are tried in the defined order, and the first to hit is applied
const statusRules = {
    "payment": [

        // User profile is "Spiderman"
        [
            [x => true, x => true, x => x !== 'Peter Parker', x => true, x => x === 'Spiderman'],
            ['⏳', '❌', 'We all know you are not who you say you are. '],
        ],

        // User Profile is "Tony Stark"
        [
            [x => true, x => x <= 1000000, x => true, x => true, x => x === 'Tony Stark'],
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
            ['⏳', '❌', 'Sorry, we don\'t do business with other species in here. '],
        ],

        // Amount is higher than 3€. User Profile is required.
        [
            [x => true, x => x > 300, x => true, x => true, x => true],
            ['⏳', '❌', 'User profile required for amounts higher than 🍤🍤🍤.'],
        ],

        // Amount is higher than 2€
        [
            [x => true, x => x >= 200, x => true, x => true, x => true],
            ['⏳', '✅'],
        ],
    ],

    "refund": [
        // User profile is "Spiderman"
        [
            [x => true, x => true, x => x !== 'Peter Parker', x => true, x => x === 'Spiderman'],
            ['⏳', '❌', 'We all know you are not who you say you are. '],
        ],

        // User Profile is "Tony Stark"
        [
            [x => true, x => x <= 1000000, x => true, x => true, x => x === 'Tony Stark'],
            ['⏳', '❌', 'Naaah. You wouldn\'t waste your time on asking for refunds.'],
        ],

        // User Profile is "Hulk"
        [
            [x => true, x => x >= true, x => true, x => true, x => x === 'Hulk'],
            ['⏳', '❌', 'Nop. You didn\'t buy anything. We know it.'],
        ],

        // User Profile is "Vicky"
        [
            [x => true, x => x >= true, x => true, x => true, x => x === 'Vicky'],
            ['⏳', '✅', 'It was free for you...why would you want a refund? But well...whatever you want...'],
        ],

        // User Profile is "Nemo"
        [
            [x => true, x => x >= true, x => true, x => true, x => x === 'Nemo'],
            ['⏳', '❌', 'Sorry, we still don\'t do business with other species in here. (And yeah, we consider ourselves, dolphins, superheroes. Or the other way around. As you please.)'],
        ],

        // Amount is higher than 3€. User Profile is required.
        [
            [x => true, x => x > 300, x => true, x => true, x => true],
            ['⏳', '❌', 'User profile required for amounts higher than 🍤🍤🍤.'],
        ],
    ]
};

const orderedFields = ['operation', 'amount', 'buyersName', 'orderIdentifier', 'userProfile'];

const calculateStatus = (info) => {
    for ([rule, result] of statusRules[info.operation]) {
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
