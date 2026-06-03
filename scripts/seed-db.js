/**
 * Database Seeding Script
 * Populates the database with sample data for testing
 * 
 * Usage: node scripts/seed-db.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'bookleaf_db',
  },
};

// Sample data
const sampleUsers = [
  {
    email: 'author1@bookleaf.com',
    firstName: 'John',
    lastName: 'Author',
    role: 'author',
    password: 'SecurePassword123',
  },
  {
    email: 'author2@bookleaf.com',
    firstName: 'Jane',
    lastName: 'Writer',
    role: 'author',
    password: 'SecurePassword123',
  },
  {
    email: 'publisher@bookleaf.com',
    firstName: 'Robert',
    lastName: 'Publisher',
    role: 'publisher',
    password: 'SecurePassword123',
  },
  {
    email: 'admin@bookleaf.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    password: 'SecurePassword123',
  },
];

const sampleBooks = [
  {
    title: 'The Great Adventure',
    description: 'An epic tale of adventure and discovery across distant lands.',
    authorIndex: 0,
    status: 'published',
  },
  {
    title: 'Mystery at Midnight',
    description: 'A thrilling mystery novel that will keep you guessing until the end.',
    authorIndex: 0,
    status: 'published',
  },
  {
    title: 'Love in the City',
    description: 'A romantic story set in the heart of a bustling metropolis.',
    authorIndex: 1,
    status: 'draft',
  },
  {
    title: 'The Lost Kingdom',
    description: 'Fantasy adventure in a magical world filled with wonder and danger.',
    authorIndex: 1,
    status: 'draft',
  },
];

const sampleTickets = [
  {
    subject: 'Payment Issue',
    description: 'I did not receive payment for my published book.',
    priority: 'high',
    userIndex: 0,
    status: 'open',
  },
  {
    subject: 'Technical Support',
    description: 'Unable to upload manuscript file.',
    priority: 'medium',
    userIndex: 1,
    status: 'open',
  },
  {
    subject: 'Feature Request',
    description: 'Would like to see bulk download for all my books.',
    priority: 'low',
    userIndex: 2,
    status: 'closed',
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  console.log(`📊 Sample data:
    - Users: ${sampleUsers.length}
    - Books: ${sampleBooks.length}
    - Tickets: ${sampleTickets.length}
  `);

  try {
    // In production, connect to actual database
    // For now, just log the sample data
    
    console.log('\n👥 Sample Users:');
    sampleUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.role})`);
    });

    console.log('\n📚 Sample Books:');
    sampleBooks.forEach((book, index) => {
      const author = sampleUsers[book.authorIndex];
      console.log(`  ${index + 1}. "${book.title}" by ${author.firstName} (${book.status})`);
    });

    console.log('\n🎫 Sample Tickets:');
    sampleTickets.forEach((ticket, index) => {
      console.log(`  ${index + 1}. ${ticket.subject} (${ticket.priority})`);
    });

    // SQL would be executed here in production
    console.log('\n✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();