require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const p = "test123";
  
  // Create a post with explicit plain text password
  const post = await prisma.post.create({
    data: {
      title: "Test string",
      slug: "test-" + Date.now(),
      content: "secret",
      type: "WRITEUP",
      status: "LOCKED",
      password: p
    }
  });

  console.log("Created post password:", post.password);
}
run();
