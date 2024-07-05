declare module 'paystack-api' {
    interface PaystackOptions {
        secretKey: string;
    }

    interface TransactionInitializeOptions {
        amount: number;
        email: string;
        reference: string;
    }

    interface TransactionInitializeResponse {
        status: boolean;
        message: string;
        data: {
            reference: string;
            authorization_url: string;
            access_code: string;
        };
    }

    class Paystack {
        constructor(secretKey: string);
        transaction: {
            initialize(options: TransactionInitializeOptions): Promise<TransactionInitializeResponse>;
        };
    }

    export default function Paystack(secretKey: string): Paystack;
}
