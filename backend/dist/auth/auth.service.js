"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../domain/repositories/user.repository");
const hash_provider_1 = require("../domain/providers/hash.provider");
const email_provider_1 = require("../domain/providers/email.provider");
const crypto_1 = require("crypto");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    hashProvider;
    emailProvider;
    constructor(userRepository, jwtService, hashProvider, emailProvider) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.hashProvider = hashProvider;
        this.emailProvider = emailProvider;
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const passwordHash = await this.hashProvider.hash(data.password);
        const verificationToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const user = await this.userRepository.create({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            age: parseInt(data.age),
            passwordHash,
            verificationToken,
        });
        await this.emailProvider.sendVerificationEmail(user.email, verificationToken);
        return {
            message: 'Registration successful. Please check your email to verify your account.',
        };
    }
    async login(data) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Account not verified. Please check your email.');
        }
        const isPasswordValid = await this.hashProvider.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async verify(token) {
        const user = await this.userRepository.findByVerificationToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Invalid verification token');
        }
        await this.userRepository.update(user.id, {
            isVerified: true,
            verificationToken: null,
        });
        return { message: 'Email verified successfully. You can now login.' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService,
        hash_provider_1.HashProvider,
        email_provider_1.EmailProvider])
], AuthService);
//# sourceMappingURL=auth.service.js.map