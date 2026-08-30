import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { Server } from 'http';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { EmailSender } from '../domain/email/email-message';
import { InMemoryPrisma } from '../testing/in-memory-prisma';
import { FakeEmailSender } from '../testing/fake-email-sender';

/**
 * Levanta la aplicacion real (mismo grafo de dependencias y mismo
 * ValidationPipe que main.ts) sustituyendo solo la base de datos y el
 * transporte de correo.
 */
describe('AuthController (HTTP)', () => {
  let app: INestApplication;
  let prisma: InMemoryPrisma;
  let emails: FakeEmailSender;
  let server: Server;

  const validBody = {
    firstName: 'Diego',
    lastName: 'Perez',
    email: 'diego@example.com',
    age: 25,
    password: 'Password1!',
    confirmPassword: 'Password1!',
  };

  beforeEach(async () => {
    prisma = new InMemoryPrisma();
    emails = new FakeEmailSender();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(EmailSender)
      .useValue(emails)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
      }),
    );
    await app.init();
    server = app.getHttpServer() as Server;
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /auth/register registra, ignora campos extra y envia el correo', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send(validBody)
      .expect(201);

    expect((res.body as { message: string }).message).toContain(
      'Registration successful',
    );
    expect(prisma.rows).toHaveLength(1);
    // confirmPassword no se persiste: el ValidationPipe lo descarta.
    expect(prisma.rows[0]).not.toHaveProperty('confirmPassword');
    expect(prisma.rows[0].age).toBe(25);
    // bcrypt real: la contrasena nunca se guarda en claro.
    expect(prisma.rows[0].passwordHash).not.toContain('Password1!');
    expect(prisma.rows[0].passwordHash).toMatch(/^\$2[aby]\$/);
    expect(emails.sent).toHaveLength(1);
    expect(emails.sent[0].to).toBe('diego@example.com');
    expect(emails.sent[0].html).toContain(
      `/verify?token=${prisma.rows[0].verificationToken}`,
    );
  });

  it('POST /auth/register rechaza datos invalidos con 400', async () => {
    await request(server)
      .post('/auth/register')
      .send({ ...validBody, email: 'no-es-un-correo' })
      .expect(400);

    await request(server)
      .post('/auth/register')
      .send({ ...validBody, age: 15 })
      .expect(400);

    await request(server)
      .post('/auth/register')
      .send({ ...validBody, password: 'debil' })
      .expect(400);

    await request(server).post('/auth/register').send({}).expect(400);

    expect(prisma.rows).toHaveLength(0);
  });

  it('POST /auth/login devuelve 401 mientras la cuenta no esta verificada', async () => {
    await request(server).post('/auth/register').send(validBody);

    await request(server)
      .post('/auth/login')
      .send({ email: validBody.email, password: validBody.password })
      .expect(401);
  });

  it('flujo completo: registro -> verificacion -> login con JWT', async () => {
    await request(server).post('/auth/register').send(validBody);
    const token = prisma.rows[0].verificationToken as string;

    await request(server).get('/auth/verify').query({ token }).expect(200);

    expect(prisma.rows[0].isVerified).toBe(true);

    const res = await request(server)
      .post('/auth/login')
      .send({ email: validBody.email, password: validBody.password })
      .expect(200);

    const { access_token: accessToken } = res.body as { access_token: string };
    expect(typeof accessToken).toBe('string');
    expect(accessToken.split('.')).toHaveLength(3);
  });

  it('GET /auth/verify sin token responde 400 y no verifica a nadie', async () => {
    await request(server).post('/auth/register').send(validBody);

    await request(server).get('/auth/verify').expect(400);
    await request(server).get('/auth/verify').query({ token: '' }).expect(400);

    expect(prisma.rows[0].isVerified).toBe(false);
  });
});
