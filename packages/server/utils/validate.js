export function findInvalidOrEmptyAttributes(object, model) {
    const userAttributes = Object.keys(model.rawAttributes);
    const invalidOrEmptyAttributes = [];

    for (const [key, value] of Object.entries(object)) {
        if (key == "educationLevel") {
            continue;
        }
        if (!userAttributes.includes(key) || !value) {
            invalidOrEmptyAttributes.push(key);
        }
    }

    return invalidOrEmptyAttributes;
}
