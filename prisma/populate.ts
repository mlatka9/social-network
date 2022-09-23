import { PrismaClient } from '@prisma/client';
import {
  createRandomImage,
  createRandomPost,
  createRandomUser,
} from './data/faker-data';

const prisma = new PrismaClient();

async function main() {
  const USERS = [] as ReturnType<typeof createRandomUser>[];
  const POSTS = [] as ReturnType<typeof createRandomPost>[];
  const IMAGES = [] as ReturnType<typeof createRandomImage>[];

  Array.from({ length: 20 }).forEach(() => {
    USERS.push(createRandomUser());
  });

  const usersIds = USERS.map((user) => user.id);

  Array.from({ length: 200 }).forEach(() => {
    const randomAuthorId =
      usersIds[Math.floor(Math.random() * usersIds.length)]!;
    POSTS.push(createRandomPost(randomAuthorId));
  });

  const postIds = POSTS.map((post) => post.id);

  Array.from({ length: 200 }).forEach(() => {
    const randomPostId = postIds[Math.floor(Math.random() * postIds.length)]!;
    IMAGES.push(createRandomImage(randomPostId));
  });

  await prisma.user.createMany({
    data: USERS.map((user) => ({
      id: user.id,
      bannerImage: user.bannerImage,
      bio: user.bio,
      email: user.email,
      image: user.image,
      name: user.name,
    })),
  });

  await prisma.post.createMany({
    data: POSTS.map((post) => ({
      id: post.id,
      content: post.content.slice(0, 200),
      userId: post.user,
      createdAt: post.createdAt,
    })),
  });

  await prisma.image.createMany({
    data: IMAGES.map((image) => ({
      fallbackUrl: "",
      url: image.url,
      postId: image.postId,
      alt: '',
      width: 100,
      height: 100,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
