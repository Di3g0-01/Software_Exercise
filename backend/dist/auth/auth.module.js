"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const email_module_1 = require("../email/email.module");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../domain/repositories/user.repository");
const prisma_user_repository_1 = require("../infrastructure/repositories/prisma-user.repository");
const hash_provider_1 = require("../domain/providers/hash.provider");
const bcrypt_hash_provider_1 = require("../infrastructure/providers/bcrypt-hash.provider");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            email_module_1.EmailModule,
            jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'fallback_secret',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            {
                provide: user_repository_1.UserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            {
                provide: hash_provider_1.HashProvider,
                useClass: bcrypt_hash_provider_1.BcryptHashProvider,
            },
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map