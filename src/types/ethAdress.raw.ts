import * as z from "zod";
export const EthAddress = z.string().regex(/^0x[0-9a-fA-F]{40}$/);
export type EthAddressType = z.infer<typeof EthAddress>;

