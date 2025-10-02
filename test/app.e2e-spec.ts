import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { APP_GUARD } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // sobrescreve o guard global para os testes
      .overrideProvider(APP_GUARD)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health deve responder 200 e {status:"ok"}', async () => {
    await request(app.getHttpServer()).get('/health').expect(200).expect({ status: 'ok' });
  });

  it('GET / deve responder 404 (rota raiz não existe)', async () => {
    await request(app.getHttpServer()).get('/').expect(404);
  });
});
