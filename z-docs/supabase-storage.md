# Supabase Storage Setup Instructions

Follow these steps to set up and configure the Supabase Storage bucket for property images and audio files.

## 1. Create the Storage Bucket

1. Log in to the [Supabase Dashboard](https://supabase.com/).
2. Select your project.
3. Click on the **Storage** icon in the left-hand sidebar.
4. Click the **New bucket** button at the top.
5. In the modal, configure the following:
   - **Bucket Name**: `test`
   - **Public Bucket**: **Enabled (Public)** (so uploaded files/images are accessible via public URLs).
6. Click **Save** to create the bucket.

## 2. Configure Row Level Security (RLS) Policies

By default, Supabase blocks all storage actions. You must add policies to allow users to read and upload files.

1. In the **Storage** section, click on **Policies** in the sidebar.
2. Find the **`test`** bucket in the list and click **New policy** (or **Insert policy**).
3. Select **For full customization (choose target, actions, etc.)** (or choose a custom option).
4. Create the following policies:

### Policy A: Allow Public Read Access (SELECT)
- **Policy Name**: `Public Read Access`
- **Allowed Operations**: Check **SELECT**
- **Target Roles**: `public`
- **USING expression**: 
  ```sql
  true
  ```

### Policy B: Allow Authenticated Uploads (INSERT)
- **Policy Name**: `Authenticated Upload Access`
- **Allowed Operations**: Check **INSERT**
- **Target Roles**: `authenticated` (recommended, so only logged-in users can upload) or `public` (if you want anonymous uploads).
- **WITH CHECK expression**:
  ```sql
  true
  ```

### Policy C: Allow Owners to Delete/Update Files (Optional)
If you want to allow users to delete/update their own uploaded files, create an additional policy:
- **Policy Name**: `Allow Owners to Delete and Update`
- **Allowed Operations**: Check **DELETE** and **UPDATE**
- **Target Roles**: `authenticated`
- **USING expression**:
  ```sql
  auth.uid() is not null
  ```
