# Qubu Satellite Project

## Setup
This project uses NodeJS 22 with a MySQL database.
1. **Install Dependencies**

   ```npm install```

2. **Configure environment**

   ```cp .env.example .env```

   Then edit .env file with your database credentials

3. **Generate authentication secret for NEXTAUTH_SECRET**

   ```openssl rand -base64 32```

   Then edit .env file with generated key

4. **Run database migrations**

   ```npx drizzle-kit migrate```

5. **Seed the database**

   ```npm run drizzle-kit-seed```

6. **Start development server**

   ```npm run dev```

7. **Verify installation**

   Open http://localhost:3000 in your browser

## Troubleshooting
- If you encounter database connection issues, verify your MySQL service is running
- For authentication errors, check that your NEXTAUTH_SECRET is properly set

