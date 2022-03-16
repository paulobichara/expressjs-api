const mockDb = {
  user: {
    findMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
  },
  post: { findMany: jest.fn(), create: jest.fn() },
};

module.exports = mockDb;
