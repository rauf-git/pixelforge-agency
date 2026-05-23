const http = require('http');
const readline = require('readline');

// Use local environment variables or default to localhost:8090
const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Helper function to ask questions in the terminal interactively
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    });
  });
}

// Zero-dependency HTTP request helper using Node.js built-in http module
function makeRequest(url, method, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const client = http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        if (data) {
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            parsed = data;
          }
        }
        resolve({
          statusCode: res.statusCode,
          body: parsed
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log(`\n\x1b[35m=== PixelForge PocketBase Auto-Setup ===\x1b[0m`);
  console.log(`Connecting to: \x1b[36m${PB_URL}\x1b[0m`);

  // Try to get credentials from command-line arguments first, otherwise ask interactively
  let email = process.argv[2];
  let password = process.argv[3];

  if (!email || !password) {
    console.log('\nPlease enter your PocketBase Admin credentials:');
    email = await askQuestion('\x1b[33m📧 Admin Email:\x1b[0m ');
    password = await askQuestion('\x1b[33m🔑 Admin Password:\x1b[0m ');
  }

  if (!email || !password) {
    console.error('\n\x1b[31mError: Both Email and Password are required to authenticate!\x1b[0m\n');
    process.exit(1);
  }

  let token = '';
  let isV23 = false;
  
  // 1. Authenticate as Admin
  // Try newer v0.23+ endpoint first: /api/collections/_superusers/auth-with-password
  console.log('\nAuthenticating Admin account...');
  try {
    const res = await makeRequest(`${PB_URL}/api/collections/_superusers/auth-with-password`, 'POST', {}, {
      identity: email,
      password: password
    });

    if (res.statusCode === 200 && res.body && res.body.token) {
      token = res.body.token;
      isV23 = true;
      console.log('\x1b[32m✔ Authenticated successfully (PocketBase v0.23+ detected)\x1b[0m');
    } else {
      // If 404, try legacy endpoint: /api/admins/auth-with-password
      console.log('v0.23 endpoint not found or failed, trying legacy v0.22- endpoint...');
      const legacyRes = await makeRequest(`${PB_URL}/api/admins/auth-with-password`, 'POST', {}, {
        identity: email,
        password: password
      });

      if (legacyRes.statusCode === 200 && legacyRes.body && legacyRes.body.token) {
        token = legacyRes.body.token;
        console.log('\x1b[32m✔ Authenticated successfully (PocketBase v0.22 or below detected)\x1b[0m');
      } else {
        throw new Error(JSON.stringify(res.body || legacyRes.body || 'Unknown authentication error'));
      }
    }
  } catch (error) {
    console.error('\n\x1b[31m✖ Authentication failed!\x1b[0m');
    console.error('Please verify that your PocketBase server is running locally at http://127.0.0.1:8090 and that your email/password are correct.');
    console.error('Details:', error.message || error);
    process.exit(1);
  }

  // PocketBase v0.23+ expects just the token. v0.22 and below expects "Admin token"
  const authHeader = { 'Authorization': isV23 ? token : `Admin ${token}` };

  // Define collections compatible with both v0.22 (schema) and v0.23 (fields)
  const collectionsToCreate = [
    {
      name: 'projects',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'category', type: 'text', required: true },
        { name: 'client', type: 'text' },
        { name: 'description', type: 'text', required: true },
        { name: 'tags', type: 'text' },
        {
          name: 'thumbnail',
          type: 'file',
          required: true,
          options: {
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp']
          }
        },
        { name: 'liveUrl', type: 'url' }
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'category', type: 'text', required: true },
        { name: 'client', type: 'text' },
        { name: 'description', type: 'text', required: true },
        { name: 'tags', type: 'text' },
        {
          name: 'thumbnail',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp']
        },
        { name: 'liveUrl', type: 'url' }
      ]
    },
    {
      name: 'testimonials',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'clientName', type: 'text', required: true },
        { name: 'roleCompany', type: 'text', required: true },
        { name: 'reviewText', type: 'text', required: true },
        { name: 'rating', type: 'number', required: true, options: { min: 1, max: 5 } },
        {
          name: 'clientAvatar',
          type: 'file',
          options: {
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp']
          }
        }
      ],
      fields: [
        { name: 'clientName', type: 'text', required: true },
        { name: 'roleCompany', type: 'text', required: true },
        { name: 'reviewText', type: 'text', required: true },
        { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
        {
          name: 'clientAvatar',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp']
        }
      ]
    },
    {
      name: 'contacts',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '', // anyone can submit!
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'message', type: 'text', required: true }
      ],
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'message', type: 'text', required: true }
      ]
    },
    {
      name: 'hero',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'badge', type: 'text', required: true },
        { name: 'title1', type: 'text', required: true },
        { name: 'title2', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'ctaText1', type: 'text' },
        { name: 'ctaText2', type: 'text' }
      ],
      fields: [
        { name: 'badge', type: 'text', required: true },
        { name: 'title1', type: 'text', required: true },
        { name: 'title2', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'ctaText1', type: 'text' },
        { name: 'ctaText2', type: 'text' }
      ]
    },
    {
      name: 'services',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'category', type: 'text', required: true },
        { name: 'icon', type: 'text', required: true },
        { name: 'order', type: 'number', required: true }
      ],
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
        { name: 'category', type: 'text', required: true },
        { name: 'icon', type: 'text', required: true },
        { name: 'order', type: 'number', required: true }
      ]
    }
  ];

  for (const collection of collectionsToCreate) {
    console.log(`\nChecking collection: \x1b[36m"${collection.name}"\x1b[0m...`);
    
    // Check if it already exists
    try {
      const getRes = await makeRequest(`${PB_URL}/api/collections/${collection.name}`, 'GET', authHeader);
      
      if (getRes.statusCode === 200) {
        console.log(`\x1b[33mℹ Collection "${collection.name}" already exists. Skipping creation.\x1b[0m`);
        continue;
      }
    } catch (e) {
      // Proceed if error is just 404 (does not exist)
    }

    // Attempt to create collection
    console.log(`Creating collection "${collection.name}"...`);
    
    const createRes = await makeRequest(`${PB_URL}/api/collections`, 'POST', authHeader, collection);

    if (createRes.statusCode === 200 || createRes.statusCode === 201) {
      console.log(`\x1b[32m✔ Collection "${collection.name}" created successfully!\x1b[0m`);
    } else {
      console.error(`\x1b[31m✖ Failed to create "${collection.name}"!\x1b[0m`);
      console.error('Response:', JSON.stringify(createRes.body));
    }
  }

  // Seeding initial/default values
  console.log(`\nSeeding default content...`);
  
  // 1. Seed Hero
  try {
    const checkHero = await makeRequest(`${PB_URL}/api/collections/hero/records`, 'GET', authHeader);
    if (checkHero.statusCode === 200 && checkHero.body && checkHero.body.items && checkHero.body.items.length === 0) {
      console.log('Hero collection is empty. Seeding default copy...');
      const seedHeroRes = await makeRequest(`${PB_URL}/api/collections/hero/records`, 'POST', authHeader, {
        badge: '✦ now scaling digital platforms',
        title1: 'we help brands turn',
        title2: 'digital chaos into clarity',
        description: 'upscalemark is a digital consultancy engineered for high-performance execution. We design and build bleeding-edge web platforms and coordinate high-impact digital campaigns to elevate your market position.',
        ctaText1: 'Start Project',
        ctaText2: 'Our Work'
      });
      if (seedHeroRes.statusCode === 200 || seedHeroRes.statusCode === 201) {
        console.log('\x1b[32m✔ Default Hero copy seeded successfully!\x1b[0m');
      } else {
        console.error('✖ Failed to seed Hero copy:', JSON.stringify(seedHeroRes.body));
      }
    } else {
      console.log('ℹ Hero copy already exists. Skipping seed.');
    }
  } catch (e) {
    console.error('Error checking/seeding Hero copy:', e);
  }

  // 2. Seed Services
  try {
    const checkServices = await makeRequest(`${PB_URL}/api/collections/services/records`, 'GET', authHeader);
    if (checkServices.statusCode === 200 && checkServices.body && checkServices.body.items && checkServices.body.items.length === 0) {
      console.log('Services collection is empty. Seeding default services...');
      const defaultServices = [
        { title: 'Paid Ads', description: 'Performance-driven campaign setups on Search and Social platforms with technical optimization and maximum conversion output.', category: 'marketing', icon: 'Target', order: 1 },
        { title: 'Social Media Management', description: 'Brand-focused content creation, curation, community nurturing, and scheduled publishing for organic reach.', category: 'marketing', icon: 'Heart', order: 2 },
        { title: 'Influencer Marketing', description: 'Sourcing, matching, and executing strategic content partnerships with creators to boost brand awareness.', category: 'marketing', icon: 'Star', order: 3 },
        { title: 'New Websites', description: 'Blisteringly fast, responsive, and SEO-optimized digital stores and corporate products built with Next.js.', category: 'web', icon: 'Layout', order: 4 },
        { title: 'Old to New Revamping', description: 'Re-engineering legacy legacy systems into highly polished, lightweight, and modern digital destinations.', category: 'web', icon: 'RefreshCw', order: 5 }
      ];
      
      for (const s of defaultServices) {
        const seedServiceRes = await makeRequest(`${PB_URL}/api/collections/services/records`, 'POST', authHeader, s);
        if (seedServiceRes.statusCode === 200 || seedServiceRes.statusCode === 201) {
          console.log(`\x1b[32m✔ Seeded service: "${s.title}"\x1b[0m`);
        } else {
          console.error(`✖ Failed to seed service "${s.title}":`, JSON.stringify(seedServiceRes.body));
        }
      }
    } else {
      console.log('ℹ Services listings already exist. Skipping seed.');
    }
  } catch (e) {
    console.error('Error checking/seeding Services:', e);
  }

  console.log(`\n\x1b[32m✔ Database setup complete! You are ready to go!\x1b[0m\n`);
}

run().catch(err => {
  console.error('Unexpected error:', err);
});
