const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function run() {
  const p = "test123";
  // The backend uses bcrypt.hash(p, 10);
  const hp = await bcrypt.hash(p, 10);
  
  // Create a post
  const post = await prisma.post.create({
    data: {
      title: "Test locked 2",
      slug: "test-locked-2-" + Date.now(),
      content: "secret",
      type: "WRITEUP",
      status: "LOCKED",
      password: hp
    }
  });

  // Now verify it EXACTLY how the API does it
  const fetched = await prisma.post.findUnique({ where: { id: post.id } });
  
  const isMatch = await bcrypt.compare(p, fetched.password);
  console.log("Match using bcrypt.compare:", isMatch);
}
run();
