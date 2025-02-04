"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const backwards_compatibility_1 = require("hardhat/internal/core/providers/backwards-compatibility");
const gas_providers_1 = require("hardhat/internal/core/providers/gas-providers");
const http_1 = require("hardhat/internal/core/providers/http");
const gasProvider_1 = require("./gasProvider");
const provider_1 = require("./provider");
require("./type-extensions");
(0, config_1.extendConfig)((config, userConfig) => {
    const userNetworks = userConfig.networks;
    if (userNetworks === undefined) {
        return;
    }
    for (const networkName in userNetworks) {
        if (networkName === "hardhat") {
            continue;
        }
        const network = userNetworks[networkName];
        if (network.kmsKeyId) {
            config.networks[networkName].kmsKeyId = network.kmsKeyId;
        }
    }
});
(0, config_1.extendEnvironment)((hre) => {
    if (hre.network.config.kmsKeyId) {
        const httpNetConfig = hre.network.config;
        const eip1193Provider = new http_1.HttpProvider(httpNetConfig.url, hre.network.name, httpNetConfig.httpHeaders, httpNetConfig.timeout);
        let wrappedProvider;
        wrappedProvider = new provider_1.KMSSigner(eip1193Provider, hre.network.config.kmsKeyId);
        wrappedProvider = new gas_providers_1.AutomaticGasProvider(wrappedProvider, hre.network.config.gasMultiplier);
        wrappedProvider = new gasProvider_1.AutomaticGasPriceProvider(wrappedProvider, hre.network.config.minMaxFeePerGas, hre.network.config.minMaxPriorityFeePerGas);
        hre.network.provider = new backwards_compatibility_1.BackwardsCompatibilityProviderAdapter(wrappedProvider);
    }
});
