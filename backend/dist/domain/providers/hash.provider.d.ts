export declare abstract class HashProvider {
    abstract hash(data: string | Buffer): Promise<string>;
    abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
