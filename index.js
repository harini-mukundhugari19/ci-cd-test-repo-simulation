import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Middleware to log everything (creates verbose logs)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
})

// Main route with multiple dependency checks
app.get('/', (req, res) => {
  console.log('=== Starting request processing ===');
  try {
    // Check 1: Database URL (CRITICAL - will fail if missing)
    console.log('Checking database configuration...');
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in environment variables');
      console.error('Expected format: postgresql://user:password@host:port/database');
      console.error('Current env keys:', Object.keys(process.env).filter(k => !k.includes('SECRET')));
      throw new Error('DATABASE_URL environment variable is required');
    }
    console.log('✓ Database URL configured');

    // Check 2: API Key (will warn if missing)
    console.log('Checking API key configuration...');
    if (!process.env.API_KEY) {
      console.warn('⚠️ API_KEY not found - external service features will be disabled');
    } else {
      console.log('✓ API Key configured');
    }

    // Check 3: Port configuration
    console.log('Checking port configuration...');
    const port = process.env.PORT || 3000;
    console.log(`✓ Port configured: ${port}`);

    // Simulate some processing
    console.log('Processing business logic...');
    console.log('Connecting to database...');
    console.log('Executing query...');
    console.log('Formatting response...');

    res.json({
      message: 'Hello there!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    console.log('=== Request completed successfully ===');
  } catch (error) {
    console.error('=== REQUEST FAILED ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('======================');
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Additional route to show the app works after fix
app.get('/api/status', (req, res) => {
  console.log('Status endpoint called');
  res.json({
    status: 'running',
    uptime: process.uptime(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error caught by middleware:');
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

// Startup checks before listening
console.log('=================================');
console.log('Starting application...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('=================================');

app.listen(PORT, () => {
  console.log(`✓ Server listening on port ${PORT}`);
  console.log('Performing startup validation...');
  
  // Validate critical env vars on startup
  const criticalEnvVars = ['DATABASE_URL'];
  const missingVars = criticalEnvVars.filter(v => !process.env[v]);
  
  if (missingVars.length > 0) {
    console.error('');
    console.error('💥 STARTUP ERROR: Missing critical environment variables');
    console.error('Missing variables:', missingVars.join(', '));
    console.error('');
    console.error('Please set the following in your .env file:');
    missingVars.forEach(v => {
      console.error(`  ${v}=<your-value-here>`);
    });
    console.error('');
    console.error('Example .env file:');
    console.error('  DATABASE_URL=postgresql://user:pass@localhost:5432/mydb');
    console.error('  API_KEY=your-api-key-here');
    console.error('  PORT=3000');
    console.error('');
    process.exit(1);
  }
  
  console.log('✓ All critical environment variables present');
  console.log('Application ready!');
});
