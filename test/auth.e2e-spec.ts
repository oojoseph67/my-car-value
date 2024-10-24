import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('demo', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World! THIS IS TOB1ASS');
  });

  it('', () => {});

  it('it handles a signup request', () => {
    const email = 'test@example.com';
    return request(app.getHttpServer())
      .post('/users/auth/signup')
      .send({ email, password: 'test123' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeGreaterThan(0);
        expect(email).toEqual(email);
      });
  });
});
