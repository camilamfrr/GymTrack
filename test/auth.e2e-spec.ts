import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers, logs in, and refreshes a token for the same user', async () => {
    const email = `auth_test_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`;

    const registerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        name: 'Auth Tester',
        email,
        password: 'Password123',
      })
      .expect(201);

    expect(registerResponse.body.user).toMatchObject({
      email,
      name: 'Auth Tester',
      role: 'USER',
    });
    expect(registerResponse.body.accessToken).toBeTypeOf('string');
    expect(registerResponse.body.refreshToken).toBeTypeOf('string');

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email,
        password: 'Password123',
      })
      .expect(201);

    expect(loginResponse.body.user.email).toBe(email);
    expect(loginResponse.body.accessToken).toBeTypeOf('string');
    expect(loginResponse.body.refreshToken).toBeTypeOf('string');

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({
        refreshToken: registerResponse.body.refreshToken,
      })
      .expect(201);

    expect(refreshResponse.body.accessToken).toBeTypeOf('string');

    const meResponse = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${refreshResponse.body.accessToken}`)
      .expect(200);

    expect(meResponse.body.email).toBe(email);
    expect(meResponse.body.passwordHash).toBeUndefined();
  });
});
