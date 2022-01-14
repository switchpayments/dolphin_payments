// Rules define initial and final status based on transaction information
// Order of info fields defined below
// Rules are tried in the defined order, and the first to hit is applied
const statusRules = [
    [
        [x => true, x => x >= 200, x => true, x => true, x => true],
        ['⏳', '✅'],
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
    return ['✅', '✅'];
}

module.exports = {
    calculateStatus,
};
