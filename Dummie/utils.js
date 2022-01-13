const operations = {
    1: 'payment',
    2: 'refund',
}

const get_chars_occurences_at_start = (array, char) => {
    let i = 0;

    for(;array[i] === char && i < array.length; i++);

    return i;
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

    return {
        operation: operation,
        amount: amount,
    };
}

module.exports = {
    parse_payload,
};
