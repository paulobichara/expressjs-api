describe('the posts route', () => {
  let request;
  let app;
  let mockDb;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.mock('../../connectors/database');
    mockDb = require('../../connectors/database');
    request = require('supertest');
    app = require('../../app');
  });

  describe('when getting an user\'s posts', () => {
    describe.each([['', 'is empty', 'User ID must be a number'], [123, 'does not exist', 'User not found']])('and the user ID is empty', (userId, _, msg) => {
      let response;

      beforeEach(async () => {
        response = await request(app).get(`/posts?userId=${userId}`).set('Accept', 'application/json').expect('Content-Type', /json/)
          .expect(400);
      });

      it('must return a proper error', () => {
        expect(response.body).toEqual({
          errors: [
            {
              location: 'query',
              msg,
              param: 'userId',
              value: userId,
            },
          ],
        });
      });
    });

    describe('and the user can be found', () => {
      const USER = { id: 123 };
      const POSTS = [{ id: 1 }, { id: 2 }, { id: 3 }];
      let response;

      beforeEach(async () => {
        mockDb.user.findUnique.mockImplementation(async () => USER);
        mockDb.post.findMany.mockImplementation(async () => POSTS);
        response = await request(app).get(`/posts/?userId=${USER.id}`).set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200);
      });

      it('must return the user posts', () => {
        expect(response.body).toEqual(POSTS);
      });
    });
  });

  describe('when creating a new post', () => {
    const USER_ID = 123;
    const REQUEST_BODY = {
      title: 'My title', content: 'Blablabla My Content', authorId: USER_ID, published: true,
    };

    describe('and the user is not found', () => {
      let response;

      beforeEach(async () => {
        response = await request(app).post(`/posts/?userId=${USER_ID}`).send(REQUEST_BODY).set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400);
      });

      it('must try to find the user by ID', () => {
        expect(mockDb.user.findUnique).toHaveBeenCalledWith({ where: { id: USER_ID } });
      });

      it('must return a proper error', () => {
        expect(response.body).toEqual({
          errors: [
            {
              location: 'query',
              msg: 'User not found',
              param: 'userId',
              value: 123,
            },
          ],
        });
      });
    });

    describe('and the user is found', () => {
      describe.each([
        ['title', null, { title: null, content: 'Content' }, 'Title must not be empty'],
        ['title', undefined, { content: 'Content' }, 'Title must not be empty'],
        ['title', '', { title: '', content: 'Content' }, 'Title must not be empty'],
        ['content', null, { content: null, title: 'Title' }, 'Content must not be empty'],
        ['content', undefined, { title: 'Title' }, 'Content must not be empty'],
        ['content', '', { content: '', title: 'Title' }, 'Content must not be empty'],
      ])('and the post %s is %s', (attribute, value, args, msg) => {
        let response;

        beforeEach(async () => {
          mockDb.user.findUnique.mockImplementation(async () => ({ id: USER_ID }));
          response = await request(app).post(`/posts/?userId=${USER_ID}`).send(args).set('Accept', 'application/json')
            .expect('Content-Type', /json/);
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
    });

    describe('and the request is valid', () => {
      const POST = { id: 456, ...REQUEST_BODY };

      let response;

      beforeEach(async () => {
        mockDb.user.findUnique.mockImplementation(async () => ({ id: USER_ID }));
        mockDb.post.create.mockImplementation(async () => POST);
        response = await request(app).post(`/posts/?userId=${USER_ID}`).send(REQUEST_BODY).set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200);
      });

      it('must properly create the post', () => {
        expect(mockDb.post.create).toHaveBeenCalledWith({ data: REQUEST_BODY });
      });

      it('must return the new post', () => {
        expect(response.body).toEqual(POST);
      });
    });
  });
});
