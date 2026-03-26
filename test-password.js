const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function test() {
  const p1 = "test123";
  const h1 = await bcrypt.hash(p1, 10);
  console.log("Hashed:", h1, "Match:", await bcrypt.compare(p1, h1));
}
test();
