const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function run() {
  const p = "test123";
  // password hashed during creation
  const hp = await bcrypt.hash(p, 10);
  console.log("Password hash during creation:", hp);

  // validation flow
  const isValid = await bcrypt.compare(p, hp);

  console.log("Validation using bcrypt.compare:", isValid);
}
run();
