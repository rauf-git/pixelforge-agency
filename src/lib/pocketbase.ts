import PocketBase from 'pocketbase';

// Determine the URL for PocketBase. By default, it connects to localhost:8090.
// During production, this will point to your deployed PocketBase instance.
const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

/**
 * DATABASE COLLECTIONS OVERVIEW & SCHEMA DEFINITIONS
 * 
 * 1. "projects"
 *    - Fields:
 *      - id (System)
 *      - title (Plain text, Required)
 *      - category (Plain text / Select, Required - e.g., "Web Development", "UI/UX Design", "Branding")
 *      - client (Plain text)
 *      - description (Long text, Required)
 *      - tags (Plain text - e.g. "Next.js, Tailwind, SQLite")
 *      - thumbnail (File - single image, Required)
 *      - liveUrl (Plain text - URL format)
 *    - Permissions (API Rules):
 *      - List/View: Public (Anyone can view projects)
 *      - Create/Update/Delete: Admin Only (@request.auth.id != "")
 * 
 * 2. "testimonials"
 *    - Fields:
 *      - id (System)
 *      - clientName (Plain text, Required)
 *      - roleCompany (Plain text, Required - e.g., "CEO, TechCorp")
 *      - reviewText (Long text, Required)
 *      - rating (Number, 1 to 5)
 *      - clientAvatar (File - single image, Optional)
 *    - Permissions (API Rules):
 *      - List/View: Public (Anyone can view testimonials)
 *      - Create/Update/Delete: Admin Only
 * 
 * 3. "contacts"
 *    - Fields:
 *      - id (System)
 *      - name (Plain text, Required)
 *      - email (Plain text - Email format, Required)
 *      - message (Long text, Required)
 *    - Permissions (API Rules):
 *      - Create: Public (Anyone can submit a contact inquiry!)
 *      - List/View/Update/Delete: Admin Only (Protected - only admin can see the inquiries)
 * 
 * 4. "users" (System default)
 *    - Fields:
 *      - id, username, email, password, avatar
 *    - Used for: Admin Login authentication to access the dashboard.
 */
