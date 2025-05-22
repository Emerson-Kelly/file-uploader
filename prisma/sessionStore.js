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
      const expiryDate = new Date(sessionData.cookie.expires);
  
      await this.prisma.session.upsert({
        where: { sid },
        update: {
          data: JSON.stringify(sessionData),
          expiresAt: expiryDate,
        },
        create: {
          sid,
          data: JSON.stringify(sessionData),
          expiresAt: expiryDate,
        },
      });
  
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
  
  async destroy(sid, callback) {
    try {
      await this.prisma.session.deleteMany({ where: { sid } });
      callback(null);
    } catch (err) {
      callback(err);
    }
  }
  
}
