import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { InMemoryPrisma } from './testing/in-memory-prisma';
import { VerificationNotifier } from './domain/notifications/verification-notifier';
import { AccessTokenProvider } from './domain/providers/access-token.provider';
import { EmailSender } from './domain/email/email-message';

/** Verifica que el grafo real (incluido el proveedor Resend) se resuelve. */
it('resuelve todas las dependencias de la aplicacion', async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue(new InMemoryPrisma())
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  expect(app.get(VerificationNotifier)).toBeDefined();
  expect(app.get(AccessTokenProvider)).toBeDefined();
  expect(app.get(EmailSender)).toBeDefined();

  await app.close();
});
