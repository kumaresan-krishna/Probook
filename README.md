# Prebook - Registration Module

A fully functional registration module for a web application using React and Supabase.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Supabase Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your Supabase URL and anon key from the project settings
3. Create a `.env` file in the root directory (copy from `.env.example`)
4. Add your Supabase credentials to the `.env` file:
```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```
5. **Set up a profiles table in Supabase SQL Editor:**

```sql
-- Create a table for public profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

6. Enable email confirmation in Supabase Auth settings

### Installation
1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

## Features

- User registration with email and password
- Form validation
- Success and error messages
- Responsive design
- Integration with Supabase Auth

## Extending the Module

To add more features to this registration module:

1. Add email verification by configuring Supabase Auth settings
2. Create additional profile fields in the registration form
3. Implement a login page to complete the authentication flow

## License

MIT 