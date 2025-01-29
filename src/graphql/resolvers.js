const providerService = require('../services/providerService');

const resolvers = {
    Mutation: {
        updateProvider: providerService.updateProvider,
    },
};

module.exports = resolvers;
