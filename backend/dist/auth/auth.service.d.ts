import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '../domain/providers/hash.provider';
import { EmailProvider } from '../domain/providers/email.provider';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly hashProvider;
    private readonly emailProvider;
    constructor(userRepository: UserRepository, jwtService: JwtService, hashProvider: HashProvider, emailProvider: EmailProvider);
    register(data: any): Promise<{
        message: string;
    }>;
    login(data: any): Promise<{
        access_token: string;
    }>;
    verify(token: string): Promise<{
        message: string;
    }>;
}
