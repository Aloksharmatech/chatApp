const disposableDomain = require('disposable-email-domains');

const isDisposableEmail = async (email) => {
    const domain = email.split("@")[1];
    return disposableDomain.includes(domain);
}

module.exports = { isDisposableEmail }