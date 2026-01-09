# How to Check and Unregister Your Site's Service Worker

## Step 1: Check for Your Site's Service Worker

1. **Open Chrome DevTools** (F12 or Cmd+Option+I on Mac)
2. Go to **Application** tab
3. In the left sidebar, click **Service Workers**
4. Look for entries with scope matching your site:
   - `https://localgovernmentreorganisation.co.uk/`
   - `https://localgovernmentreorganisation.netlify.app/`

## Step 2: Unregister the Service Worker

If you see a service worker for your site:

1. Click on the service worker entry
2. Click the **Unregister** button
3. Also click **Clear storage** → **Clear site data** to remove cached files

## Step 3: Clear Browser Cache

1. In DevTools, go to **Application** tab
2. Click **Storage** in the left sidebar
3. Click **Clear site data** button
4. Check all boxes and click **Clear site data**

## Step 4: Hard Refresh

- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + Shift + F5`

## Alternative: Unregister via Console

Open the Console tab in DevTools and run:

```javascript
// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('Unregistered:', registration.scope);
  }
});

// Clear all caches
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
    console.log('Deleted cache:', name);
  }
});
```

Then refresh the page.
