import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST) ', () => {
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

  it('signup  as a new user then get the currently logged in user', async () => {
    const email = 'email@email.com';

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
