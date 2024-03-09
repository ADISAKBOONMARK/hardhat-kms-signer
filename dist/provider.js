"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMSSigner = void 0;
const eth_signer_kms_1 = require("@rumblefishdev/eth-signer-kms");
const client_kms_1 = require("@aws-sdk/client-kms");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const transactionRequest_1 = require("hardhat/internal/core/jsonrpc/types/input/transactionRequest");
const validation_1 = require("hardhat/internal/core/jsonrpc/types/input/validation");
const chainId_1 = require("hardhat/internal/core/providers/chainId");
const utils_2 = require("./utils");
class KMSSigner extends chainId_1.ProviderWrapperWithChainId {
    constructor(provider, kmsKeyId) {
        super(provider);
        this.kmsKeyId = kmsKeyId;
        this.kmsInstance = new client_kms_1.KMSClient();
    }
    async request(args) {
        var _a, _b, _c;
        const method = args.method;
        const params = this._getParams(args);
        const sender = await this._getSender();
        if (method === "eth_sendTransaction") {
            const [txRequest] = validation_1.validateParams(params, transactionRequest_1.rpcTransactionRequest);
            const tx = await ethers_1.utils.resolveProperties(txRequest);
            const nonce = (_a = tx.nonce) !== null && _a !== void 0 ? _a : (await this._getNonce(sender));
            const baseTx = {
                chainId: (await this._getChainId()) || undefined,
                data: tx.data,
                gasLimit: tx.gas,
                gasPrice: tx.gasPrice,
                nonce: Number(nonce),
                type: 2,
                to: utils_2.toHexString(tx.to),
                value: tx.value,
                maxFeePerGas: (_b = tx.maxFeePerGas) === null || _b === void 0 ? void 0 : _b.toString(),
                maxPriorityFeePerGas: (_c = tx.maxPriorityFeePerGas) === null || _c === void 0 ? void 0 : _c.toString(),
            };
            if (baseTx.maxFeePerGas === undefined &&
                baseTx.maxPriorityFeePerGas === undefined) {
                baseTx.type = 0;
                delete baseTx.maxFeePerGas;
                delete baseTx.maxPriorityFeePerGas;
            }
            const unsignedTx = ethers_1.utils.serializeTransaction(baseTx);
            const hash = utils_1.keccak256(ethers_1.utils.arrayify(unsignedTx));
            const sig = await eth_signer_kms_1.createSignature({
                kmsInstance: this.kmsInstance,
                keyId: this.kmsKeyId,
                message: hash,
                address: sender,
            });
            const rawTx = ethers_1.utils.serializeTransaction(baseTx, sig);
            return this._wrappedProvider.request({
                method: "eth_sendRawTransaction",
                params: [rawTx],
            });
        }
        else if (args.method === "eth_accounts" ||
            args.method === "eth_requestAccounts") {
            return [sender];
        }
        return this._wrappedProvider.request(args);
    }
    async _getSender() {
        if (!this.ethAddress) {
            this.ethAddress = await eth_signer_kms_1.getEthAddressFromKMS({
                keyId: this.kmsKeyId,
                kmsInstance: this.kmsInstance,
            });
        }
        return this.ethAddress;
    }
    async _getNonce(address) {
        const response = await this._wrappedProvider.request({
            method: "eth_getTransactionCount",
            params: [address, "pending"],
        });
        return ethers_1.BigNumber.from(response).toNumber();
    }
}
exports.KMSSigner = KMSSigner;
