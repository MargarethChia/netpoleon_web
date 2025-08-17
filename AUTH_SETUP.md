# Supabase Authentication Setup for Netpoleon Admin

This guide explains how to set up Supabase authentication for the admin panel.

## Prerequisites

1. **Supabase Project**: You need a Supabase project with authentication enabled
2. **Environment Variables**: Set up the required environment variables

## Environment Variables

Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_ANON_KEY=your_supabase_anon_key
```

## Setting Up Authentication in Supabase

### 1. Enable Email/Password Authentication

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Email** provider
4. Make sure **Enable email confirmations** is **OFF** (for admin access)

### 2. Create Admin User

1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Enter admin email and password
4. Set **Email Confirmed** to **true**
5. Set **User Role** if you have RLS policies

### 3. Optional: Row Level Security (RLS)

If you want to secure your database tables, enable RLS and create policies:

```sql
-- Enable RLS on tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Example policy for authenticated users only
CREATE POLICY "Allow authenticated users" ON events
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON resources
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users" ON vendors
FOR ALL USING (auth.role() = 'authenticated');
```

## How It Works

### Authentication Flow

1. **Login Page** (`/login`): Users enter credentials
2. **Protected Routes**: All admin routes (`/admin/*`) require authentication
3. **Automatic Redirects**: Unauthenticated users are redirected to login
4. **Session Persistence**: User sessions are maintained across page refreshes

### Components

- **AuthContext**: Manages authentication state across the app
- **ProtectedRoute**: Wraps admin content and checks authentication
- **AdminLayout**: Includes logout functionality in the sidebar

### Security Features

- **Client-side Protection**: Routes are protected at the component level
- **Session Management**: Automatic token refresh and session persistence
- **Secure Logout**: Proper session cleanup on logout

## Testing

1. Start your development server: `npm run dev`
2. Navigate to `/admin` - you should be redirected to `/login`
3. Use your admin credentials to log in
4. You should be redirected to `/admin` dashboard
5. Try accessing other admin routes - they should work
6. Click logout - you should be redirected back to login

## Troubleshooting

### Common Issues

1. **Environment Variables**: Make sure your Supabase URL and key are correct
2. **CORS**: Ensure your Supabase project allows your domain
3. **Authentication Provider**: Verify email/password auth is enabled
4. **User Status**: Make sure the admin user is confirmed and active

### Debug Mode

Check the browser console for authentication errors and network requests.

## Production Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Domain Restrictions**: Configure allowed domains in Supabase
3. **Rate Limiting**: Consider implementing rate limiting on login attempts
4. **Audit Logs**: Monitor authentication events in Supabase dashboard 