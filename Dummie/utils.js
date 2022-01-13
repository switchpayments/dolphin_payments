const operations = {
    1: 'payment',
    2: 'refund',
}

const fields = {
    '01': 'buyerName',
    '02': 'orderIdentifier',
    '03': 'callbackUrl',
    '04': 'userProfile',
}

const required_fields = ['orderIdentifier', 'callbackUrl']

const get_chars_occurences_at_start = (array, char) => {
    let i = 0;

    for(;array[i] === char && i < array.length; i++);

    return i;
}

const parse_fields = (message) => {
    const res = {};
    let i = 0;

    while(i < message.length) {
        const field_type = fields[message.slice(i, i + 2).join('')];
        const field_lenght = parseInt(message.slice(i + 3, i + 5).join(''));
        const field_value = message.slice(i + 5, i + 5 + field_lenght).join('');
        i = i + 5 + field_lenght;

        if (field_type in res) {
            throw '🤡';
        }

        res[field_type] = field_value;
    }

    return res;
}

const parse_payload = (message) => {
    if (!message) {
        throw '🤡';
    }

    message = Array.from(message);

    let operation = message.splice(0, get_chars_occurences_at_start(message, '🐬')).length;
    if (!(operation in operations)) {
        throw '🤡';
    }
    operation = operations[operation];

    const amount_major = message.splice(0, get_chars_occurences_at_start(message, '🍤')).length;
    const amunt_minor = message.splice(0, get_chars_occurences_at_start(message, '🦐')).length;
    if(amount_major === 0 && amunt_minor === 0) {
        throw '🤡';
    }
    const amount = amount_major * 100 + amunt_minor;

    let other_fields = {}

    try {
        other_fields = parse_fields(message);
    } catch {
        throw '🤡';
    }

    for (const required_field of required_fields) {
        if (!(required_field in other_fields)) {
            throw '🤡';
        }
    }

    return {
        operation: operation,
        amount: amount,
        ...other_fields,
    };
}

const encodeField = (fieldID, fieldValue) => `${fieldID}${fieldValue.length.toString().padStart(3, '0')}${fieldValue}`

module.exports = {
    encodeField,
    parse_payload,
};
