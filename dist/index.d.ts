import { Context, Schema } from 'cordis';
export declare const name = "dsh-plugin-vajraclaw";
export interface Config {
    gatewayUrl: string;
    enableEmbeddedEngine: boolean;
    strictFailClosed: boolean;
    licenseKey?: string;
    auditLogDir?: string;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
