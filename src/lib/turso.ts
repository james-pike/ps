import { createClient, Value } from '@libsql/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Get environment variables with fallbackss
const databaseUrl = process.env.PRIVATE_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || 'libsql://placeholder.turso.io';
const authToken = process.env.PRIVATE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || 'placeholder-token';

console.log('Database URL:', databaseUrl);
console.log('Auth Token:', authToken ? '***' + authToken.slice(-4) : 'undefined');

export const turso = createClient({
  url: databaseUrl,
  authToken: authToken,
});

export async function getClasses() {
  try {
    console.log('Attempting to query classes table...');
    const result = await turso.execute('SELECT * FROM classes ORDER BY position ASC');
    console.log('Query successful, found', result.rows.length, 'classes');
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    console.log('Falling back to mock data');
    return [
      {
        id: 1,
        name: 'Sample Class',
        instructor: 'John Doe',
        date: new Date().toISOString(),
        description: 'This is a sample class for development',
        duration: '2 hours',
        price: '$50',
        image: null,
        url: 'https://example.com',
        isActive: 1
      }
    ];
  }
}
export async function getClassById(classId: number) {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM classes WHERE id = ? AND isActive = 1',
      args: [classId]
    });
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

// Function to get image manifest (for static images)
function getImageManifest() {
  try {
    const manifestPath = join(process.cwd(), 'public', 'images', 'manifest.json');
    if (existsSync(manifestPath)) {
      const manifestData = readFileSync(manifestPath, 'utf-8');
      return JSON.parse(manifestData);
    }
  } catch (error) {
    console.error('Error reading image manifest:', error);
  }
  return [];
}

// Functions for items/images (for dashboard) - using static images
export async function getItems() {
  try {
    console.log('Attempting to query items with images...');
    const result = await turso.execute(`
      SELECT 
        i.id,
        i.title,
        i.description,
        i.created_at,
        img.mime_type,
        img.alt_text,
        CASE WHEN img.image_data IS NOT NULL THEN 1 ELSE 0 END as has_image
      FROM items i
      LEFT JOIN images img ON i.id = img.item_id
      ORDER BY i.created_at DESC
    `);
    
    console.log('Items query successful, found', result.rows.length, 'items');
    
    // Get image manifest for static file paths
    const imageManifest = getImageManifest();
    
    // Return metadata with static image paths
    return result.rows.map(row => {
      const imageInfo = imageManifest.find((img: { id: Value; }) => img.id === row.id);
      
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        created_at: row.created_at,
        mime_type: row.mime_type,
        alt_text: row.alt_text,
        has_image: row.has_image,
        image_path: imageInfo ? `/images/${imageInfo.filename}` : null
      };
    });
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export async function getItemWithImages(itemId: number) {
  try {
    const result = await turso.execute({
      sql: `
        SELECT 
          i.id,
          i.title,
          i.description,
          i.created_at,
          img.mime_type,
          img.alt_text,
          CASE WHEN img.image_data IS NOT NULL THEN 1 ELSE 0 END as has_image
        FROM items i
        LEFT JOIN images img ON i.id = img.item_id
        WHERE i.id = ?
      `,
      args: [itemId]
    });
    
    const imageManifest = getImageManifest();
    const processedRows = result.rows.map(row => {
      const imageInfo = imageManifest.find((img: { id: Value; }) => img.id === row.id);
      
      return {
        ...row,
        image_path: imageInfo ? `/images/${imageInfo.filename}` : null
      };
    });
    
    return {
      item: processedRows[0] || null,
      images: processedRows
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      item: null,
      images: []
    };
  }
}

// Keep the old functions for backward compatibility
export async function getCourses() {
  return getClasses();
}

// Helper function to create turso client (for routeLoaders)
export function tursoClient(event: any) {
  return createClient({
    url: databaseUrl,
    authToken: authToken,
  });
}

export async function getFaqs() {
  try {
    console.log('Attempting to query faqs table...');
    const result = await turso.execute('SELECT * FROM faqs ORDER BY position ASC');
    console.log('Query successful, found', result.rows.length, 'faqs');
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    console.log('Falling back to mock data');
    return [
      {
        id: 1,
        question: "Can I keep what I msssake?",
        answer: "Yes! During your workshop, you will create a unique clay piece. It will stay with us until the process of drying and firing in our kiln is completed. We will contact you to pick up your creation once the process is completed - usually 3-4 weeks.",
        category: "General"
      },
      {
        id: 2,
        question: "Who are your facilitators?",
        answer: "Phineas Stewart's facilitators are skilled professionals. They possess a unique blend of empathy, communication skills, and emotional intelligence. They have a natural ability to create a safe and supportive environment where participants feel comfortable sharing their thoughts, feelings, and experiences.",
        category: "General"
      },
      {
        id: 4,
        question: "How long is each session?",
        answer: "Most classes run between 2–3 hours, depending on the workshop.",
        category: "General"
      },
      {
        id: 5,
        question: "What is your studio like?",
        answer: "Our studio is located on a quiet street. To honour privacy and create a safe, focused environment, only participants and the facilitator are present in the studio during classes and workshops.",
        category: "General"
      },
      {
        id: 6,
        question: "Do facilitators bring a spirit of reflection and presence?",
        answer: "At Phineas Stewart our facilitators bring meaningful experience working with clay. They bring a deep commitment to guiding others in discovering how the clay can awaken within them. Each facilitator holds space with care - for creative exploration, reflection, and personal insight - inviting a journey that is grounding and expansive through the process of clay work.",
        category: "General"
      },
      {
        id: 7,
        question: "Do you offer private events?",
        answer: "Yes, we host private workshops and team events. Our next open house is in October!",
        category: "General"
      }
    ];
  }
}
