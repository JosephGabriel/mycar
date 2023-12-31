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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(201)
      .then((data) => {
        expect(data.body.email).toBeDefined();
        expect(data.body.id).toBeDefined();
        expect(data.body.password).not.toBeDefined();
      });
  });
});
