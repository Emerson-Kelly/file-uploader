import session from "express-session";

// Custom Prisma session store for express-session

export default class PrismaSessionStore extends session.Store {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async get(sid, callback) {
    try {
      const session = await this.prisma.session.findUnique({ where: { sid } });
      if (!session) return callback(null, null);
      callback(null, JSON.parse(session.data));
    } catch (err) {
      callback(err);
    }
  }

  async set(sid, sessionData, callback) {
    try {
      await this.prisma.session.upsert({
        where: { sid },
        update: {
          data: JSON.stringify(sessionData),
          expires: sessionData.cookie.expires,
        },
        create: {
          sid,
          data: JSON.stringify(sessionData),
          expires: sessionData.cookie.expires,
        },
      });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }

  async destroy(sid, callback) {
    try {
      await this.prisma.session.delete({ where: { sid } });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
}
