describe('the index route', () => {
  const mockDb = {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    post: { findMany: jest.fn(), create: jest.fn() },
  };

  let request;
  let app;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mock('../../connectors/database', () => mockDb);
    request = require('supertest');
    app = require('../../app');
  });

  describe('when getting the existing users', () => {
    const USERS = [{ id: 1 }, { id: 2 }, { id: 3 }];
    let response;

    beforeEach(async () => {
      mockDb.user.findMany.mockImplementation(async () => USERS);
      response = await request(app).get('/users/');
    });

    it('must return the users from the database', async () => {
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(USERS);
    });
  });

  describe('when creating a new user', () => {
    describe.each([
      ['email', null, { email: null }, 'E-mail is not valid'],
      ['email', undefined, { }, 'E-mail is not valid'],
      ['email', 'aaaaa', { email: 'aaaaa' }, 'E-mail is not valid'],
      ['name', ' ', { email: 'aa@ba.com', name: ' ' }, 'Name must not be an empty string'],
      ['bio', ' ', { email: 'aa@ba.com', bio: ' ' }, 'Bio must not be an empty string'],
      ['photo', 'http-invalid-url', { email: 'aa@ba.com', photo: 'http-invalid-url' }, 'Photo must be a URL'],
    ])('and the user %s is %s', (attribute, value, args, msg) => {
      let response;

      beforeEach(async () => {
        response = await request(app).post('/users/').send(args).set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400);
      });

      it('must return a proper error', () => {
        expect(response.body).toEqual({
          errors: [
            {
              location: 'body',
              msg,
              param: attribute,
              value,
            },
          ],
        });
      });
    });

    describe('and the user email is already in use', () => {
      const USER = { id: 123 };
      let response;

      beforeEach(async () => {
        mockDb.user.findFirst.mockImplementation(async () => USER);
        response = await request(app).post('/users/').send({ email: 'john@domain.com' }).set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400);
      });

      it('must return a proper error', () => {
        expect(response.body).toEqual({
          errors: [
            {
              location: 'body',
              msg: 'E-mail is already in use',
              param: 'email',
              value: 'john@domain.com',
            },
          ],
        });
      });
    });

    describe('and the user email is valid and not in use', () => {
      const REQUEST_BODY = { email: 'john@domain.com' };
      const USER = { id: 123, ...REQUEST_BODY };

      let response;

      beforeEach(async () => {
        mockDb.user.create.mockImplementation(async () => USER);
        response = await request(app).post('/users/').send(REQUEST_BODY).set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200);
      });

      it('must return a proper error', () => {
        expect(response.body).toEqual(USER);
      });
    });
  });
});
