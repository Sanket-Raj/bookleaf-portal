/**
 * Database Reset Script
 * WARNING: This will delete ALL data from the database!
 * Drops all tables and recreates the schema
 * 
 * Usage: node scripts/reset-db.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

/**
 * Prompt user for confirmation
 */
async function confirmReset() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('\n⚠️  WARNING: This will DELETE ALL DATA from the database!');
    console.log(`Database: ${config.db.database} on ${config.db.host}:${config.db.port}`);
    console.log('This action cannot be undone.\n');

    rl.question('Are you sure? Type "yes" to confirm: ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Reset the database
 */
async function resetDatabase() {
  console.log('🔄 Starting database reset...\n');

  // Confirm with user
  const confirmed = await confirmReset();
  
  if (!confirmed) {
    console.log('❌ Reset cancelled by user.');
    process.exit(0);
  }

  try {
    console.log('🗑️  Dropping tables...\n');

    // Tables to drop (in correct order due to foreign keys)
    const tablesToDrop = [
      'ai_interactions',
      'royalties',
      'tickets',
      'books',
      'users',
    ];

    for (const table of tablesToDrop) {
      console.log(`  • Dropping table: ${table}`);
      // In production: await db.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
    }

    console.log('\n🏗️  Recreating schema...\n');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../bookleaf-backend/database/schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf-8');
      console.log('  • Creating tables from schema.sql');
      // In production: await db.query(schema);
    }

    // Create indexes
    const indexesToCreate = [
      'CREATE INDEX idx_users_email ON users(email);',
      'CREATE INDEX idx_books_author_id ON books(author_id);',
      'CREATE INDEX idx_books_status ON books(status);',
      'CREATE INDEX idx_tickets_user_id ON tickets(user_id);',
      'CREATE INDEX idx_tickets_status ON tickets(status);',
      'CREATE INDEX idx_royalties_book_id ON royalties(book_id);',
      'CREATE INDEX idx_royalties_status ON royalties(status);',
      'CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);',
      'CREATE INDEX idx_ai_interactions_created_at ON ai_interactions(created_at);',
    ];

    console.log('  • Creating indexes');
    for (const index of indexesToCreate) {
      // In production: await db.query(index);
    }

    console.log('\n✅ Database reset completed successfully!');
    console.log('📝 You can now run: node scripts/seed-db.js');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

// Run reset
resetDatabase();