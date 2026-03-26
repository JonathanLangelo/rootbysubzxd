const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const p = "test123";
  const requestBody = JSON.stringify({ id: "dummy", password: p });

  const fetch = require('node-fetch'); // wait node 18 has fetch natively
  
  // We can just call localhost if it's running
}
