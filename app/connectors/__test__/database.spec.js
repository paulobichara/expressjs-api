describe('the database connector', () => {
  const mockPrismaClient = { client: 'mock-prisma-client' };

  let db;

  beforeEach(() => {
    jest.resetAllMocks();

    jest.mock('@prisma/client', () => ({
      PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
    }));

    db = require('../database');
  });

  it('must return a prisma client instance', () => {
    expect(db).toEqual(mockPrismaClient);
  });
});
