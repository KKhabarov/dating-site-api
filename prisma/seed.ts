import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.photo.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.connection.deleteMany({});
  await prisma.user.deleteMany({});

  const SALT_ROUNDS = 10;
  const password = await bcrypt.hash('password123', SALT_ROUNDS);

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice@example.com',
        passwordHash: password,
        name: 'Alice Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Software engineer passionate about building scalable applications',
        location: 'San Francisco, CA',
        interests: ['coding', 'hiking', 'photography', 'travel'],
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
        goals: 'Looking to connect with other tech professionals and expand my network',
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@example.com',
        passwordHash: password,
        name: 'Bob Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        bio: 'Product manager with a love for innovation and team collaboration',
        location: 'New York, NY',
        interests: ['product management', 'startups', 'reading', 'running'],
        skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
        goals: 'Seeking to collaborate with designers and engineers on exciting projects',
      },
    }),
    prisma.user.create({
      data: {
        email: 'carol@example.com',
        passwordHash: password,
        name: 'Carol Davis',
        avatar: 'https://i.pravatar.cc/150?img=3',
        bio: 'UX/UI designer creating beautiful and intuitive user experiences',
        location: 'San Francisco, CA',
        interests: ['design', 'art', 'hiking', 'photography'],
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        goals: 'Looking to network with fellow designers and learn from industry leaders',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david@example.com',
        passwordHash: password,
        name: 'David Wilson',
        avatar: 'https://i.pravatar.cc/150?img=4',
        bio: 'Full-stack developer and open-source contributor',
        location: 'Austin, TX',
        interests: ['coding', 'gaming', 'travel', 'music'],
        skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker'],
        goals: 'Want to connect with developers working on AI and machine learning',
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma@example.com',
        passwordHash: password,
        name: 'Emma Brown',
        avatar: 'https://i.pravatar.cc/150?img=5',
        bio: 'Data scientist passionate about machine learning and AI',
        location: 'Boston, MA',
        interests: ['data science', 'reading', 'yoga', 'travel'],
        skills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Machine Learning'],
        goals: 'Seeking collaboration on AI research and innovative data projects',
      },
    }),
    prisma.user.create({
      data: {
        email: 'frank@example.com',
        passwordHash: password,
        name: 'Frank Martinez',
        avatar: 'https://i.pravatar.cc/150?img=6',
        bio: 'DevOps engineer focused on cloud infrastructure and automation',
        location: 'Seattle, WA',
        interests: ['cloud computing', 'automation', 'cycling', 'cooking'],
        skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker'],
        goals: 'Looking to share knowledge about cloud architecture and DevOps practices',
      },
    }),
    prisma.user.create({
      data: {
        email: 'grace@example.com',
        passwordHash: password,
        name: 'Grace Lee',
        avatar: 'https://i.pravatar.cc/150?img=7',
        bio: 'Marketing specialist with expertise in digital strategy',
        location: 'Los Angeles, CA',
        interests: ['marketing', 'social media', 'photography', 'fitness'],
        skills: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
        goals: 'Want to network with creative professionals and marketing innovators',
      },
    }),
    prisma.user.create({
      data: {
        email: 'henry@example.com',
        passwordHash: password,
        name: 'Henry Taylor',
        avatar: 'https://i.pravatar.cc/150?img=8',
        bio: 'Cybersecurity expert protecting digital assets',
        location: 'Washington, DC',
        interests: ['security', 'technology', 'chess', 'reading'],
        skills: ['Penetration Testing', 'Security Auditing', 'Cryptography', 'Risk Assessment'],
        goals: 'Seeking to connect with security professionals and share best practices',
      },
    }),
    prisma.user.create({
      data: {
        email: 'isabel@example.com',
        passwordHash: password,
        name: 'Isabel Garcia',
        avatar: 'https://i.pravatar.cc/150?img=9',
        bio: 'Entrepreneur and startup founder',
        location: 'San Francisco, CA',
        interests: ['startups', 'entrepreneurship', 'networking', 'travel'],
        skills: ['Business Development', 'Fundraising', 'Strategy', 'Leadership'],
        goals: 'Looking to meet potential co-founders and investors',
      },
    }),
    prisma.user.create({
      data: {
        email: 'jack@example.com',
        passwordHash: password,
        name: 'Jack Anderson',
        avatar: 'https://i.pravatar.cc/150?img=10',
        bio: 'Mobile app developer creating amazing user experiences',
        location: 'Chicago, IL',
        interests: ['mobile development', 'gaming', 'fitness', 'music'],
        skills: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'UI/UX'],
        goals: 'Want to collaborate on innovative mobile projects',
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create some connections
  await prisma.connection.create({
    data: {
      fromUserId: users[0].id,
      toUserId: users[1].id,
      status: 'ACCEPTED',
    },
  });

  await prisma.connection.create({
    data: {
      fromUserId: users[0].id,
      toUserId: users[2].id,
      status: 'PENDING',
    },
  });

  await prisma.connection.create({
    data: {
      fromUserId: users[3].id,
      toUserId: users[0].id,
      status: 'ACCEPTED',
    },
  });

  console.log('Created sample connections');

  // Create some likes
  await prisma.like.create({
    data: {
      fromUserId: users[0].id,
      toUserId: users[4].id,
    },
  });

  await prisma.like.create({
    data: {
      fromUserId: users[1].id,
      toUserId: users[0].id,
    },
  });

  console.log('Created sample likes');

  // Create some messages
  await prisma.message.create({
    data: {
      fromUserId: users[0].id,
      toUserId: users[1].id,
      content: 'Hi Bob! Would love to connect and discuss tech trends.',
      read: true,
    },
  });

  await prisma.message.create({
    data: {
      fromUserId: users[1].id,
      toUserId: users[0].id,
      content: 'Hi Alice! Absolutely, I\'d be happy to chat. What are you working on these days?',
      read: false,
    },
  });

  console.log('Created sample messages');

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
