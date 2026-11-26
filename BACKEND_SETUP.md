# Backend setup (Supabase)

1. Create a free project at supabase.com (note the database password; you won't need it in the app).
2. **SQL Editor** -> New query -> paste `supabase/schema.sql` -> Run. Then do the same with `supabase/seed.sql`.
3. **Authentication -> Sign In / Providers -> Email**: turn OFF "Confirm email" while testing
   (otherwise every new account must click an emailed link first).
4. **Project Settings -> API**: copy the Project URL and the `anon` public key.
5. In the project folder: copy `.env.example` to `.env` and paste both values in.
6. Install the two new packages and restart with a cleared cache:
       npx expo install @supabase/supabase-js react-native-url-polyfill
       npx expo start -c
7. Create an account in the app. Then make yourself an admin (SQL Editor):
       update public.profiles set is_admin = true where email = 'you@example.com';
   Reopen the app: the "Review queue" row is now active.

## How it works
- Logins: Supabase Auth. A profile row is created automatically at sign-up.
- Row Level Security (in schema.sql) is the real security: users only read/write their own
  profile, follows and saved events; only approved events are visible to others; only admins
  approve events or edit organizations. Nobody can make themselves admin from the app.
- Live updates: the app listens for changes to events/organizations, so an approval on one
  phone appears on every other phone.
- Add real clubs/businesses in **Table Editor -> organizations**.
- Never put the `service_role` key in the app or in .env.
