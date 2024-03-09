import { ProviderWrapper } from "hardhat/internal/core/providers/wrapper";
import { EIP1193Provider, RequestArguments } from "hardhat/types";
export declare class AutomaticGasPriceProvider extends ProviderWrapper {
    static readonly EIP1559_BASE_FEE_MAX_FULL_BLOCKS_PREFERENCE: number;
    static readonly EIP1559_REWARD_PERCENTILE: number;
    private _nodeHasFeeHistory?;
    private _nodeSupportsEIP1559?;
    private _minMaxFeePerGas?;
    private _minMaxPriorityFeePerGas?;
    constructor(provider: EIP1193Provider, minMaxFeePerGas?: string | number, minMaxPriorityFeePerGas?: string | number);
    request(args: RequestArguments): Promise<unknown>;
    private _validateMinMaxGas;
    private _getGasPrice;
    private _suggestEip1559FeePriceValues;
}
