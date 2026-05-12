# SQLite to PostgreSQL Migration Guide

## Changes Made

### 1. **Prisma Schema Updated** (`prisma/schema.prisma`)
- ✅ Changed datasource provider from `"sqlite"` to `"postgresql"`
- ✅ Booking model remains compatible:
  - `String @id @default(cuid())` works perfectly with PostgreSQL
  - `@default(now())` and `@updatedAt` are fully supported
  - No SQLite-specific features were present

### 2. **Environment Files Created**
- ✅ `.env.example` - Template for all environment variables
- ✅ `.env.local` - Local development configuration (update with your credentials)

## Next Steps for Local Development

### Option A: Using PostgreSQL Locally

1. **Install PostgreSQL** (if not already installed)
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Or use Docker: `docker run --name raduno-db -e POSTGRES_PASSWORD=raduno_password -e POSTGRES_USER=raduno_user -e POSTGRES_DB=raduno26 -p 5432:5432 -d postgres`

2. **Update `.env.local` with your PostgreSQL connection**
   ```
   DATABASE_URL="postgresql://raduno_user:raduno_password@localhost:5432/raduno26"
   ```

3. **Create and push migrations**
   ```
   npx prisma migrate dev --name init
   ```
   This will:
   - Create the migration file
   - Apply it to your PostgreSQL database
   - Generate Prisma Client

4. **Verify the database**
   ```
   npx prisma studio
   ```
   Opens a visual database explorer

### Option B: Skip Local PostgreSQL (Cloud-only)

If you want to test with your Render PostgreSQL during deployment:
1. Deploy to Render first
2. Render will automatically create the database from `render.yaml`
3. Verify with Render's dashboard

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/dbname` |
| `NEXT_PUBLIC_SITE_URL` | Your app's public URL | `https://raduno-26-ticketing.onrender.com` |
| `ADMIN_SECRET` | Secret key for admin access | Any random secure string |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud ID | Your cloud name from Cloudinary |
| `CLOUDINARY_API_KEY` | Cloudinary API key | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | From Cloudinary dashboard |

## Deployment to Render

1. Commit and push all changes (including `render.yaml`)
2. Go to render.com and create a new project from your GitHub repo
3. Select the `render.yaml` file for deployment configuration
4. Add missing environment variables in Render dashboard:
   - `ADMIN_SECRET`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Render will automatically:
   - Create PostgreSQL database
   - Run migrations
   - Build and deploy your app

## Migration Details

### What Changed:
- SQLite → PostgreSQL (production-ready database)

### What Stayed the Same:
- All Prisma model definitions
- All API endpoints
- All environment variable names
- Database operations (Prisma abstracts differences)

### Compatibility:
- ✅ Next.js App Router fully compatible
- ✅ Prisma Client fully compatible
- ✅ All existing server actions work unchanged
- ✅ File upload functionality unchanged
- ✅ QR code generation unchanged

## Troubleshooting

### Connection String Issues
If `DATABASE_URL` fails:
- Windows: Ensure PostgreSQL is running (`Services` → look for PostgreSQL)
- Check username and password are correct
- Verify database name exists
- Ensure port 5432 is accessible

### Migration Errors
If `npx prisma migrate dev` fails:
1. Check database is empty or compatible
2. Verify PostgreSQL server is running
3. Test connection: `psql postgresql://user:password@localhost:5432/raduno26`

### Render Deployment Issues
- Check all environment variables are set in Render dashboard
- Verify GitHub repo is connected and up to date
- Check Render logs for detailed error messages
- Ensure `render.yaml` is in the root directory
