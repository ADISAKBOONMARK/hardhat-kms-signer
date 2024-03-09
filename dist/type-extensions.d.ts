import "hardhat/types/config";
declare module "hardhat/types/config" {
    interface HttpNetworkUserConfig {
        kmsKeyId?: string;
        minMaxFeePerGas?: string | number;
        minMaxPriorityFeePerGas?: string | number;
    }
    interface HardhatNetworkUserConfig {
        kmsKeyId?: string;
        minMaxFeePerGas?: string | number;
        minMaxPriorityFeePerGas?: string | number;
    }
    interface HttpNetworkConfig {
        kmsKeyId?: string;
        minMaxFeePerGas?: string | number;
        minMaxPriorityFeePerGas?: string | number;
    }
    interface HardhatNetworkConfig {
        kmsKeyId?: string;
        minMaxFeePerGas?: string | number;
        minMaxPriorityFeePerGas?: string | number;
    }
}
