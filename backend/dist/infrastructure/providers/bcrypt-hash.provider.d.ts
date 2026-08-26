import { HashProvider } from '../../domain/providers/hash.provider';
export declare class BcryptHashProvider implements HashProvider {
    hash(data: string | Buffer): Promise<string>;
    compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
