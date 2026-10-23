# AutoVault frontend

React, Vite and Tailwind CSS frontend for Shashank Bhat's Car Dealership Inventory System. Follow the [root setup instructions](../README.md) to start the persistent database and FastAPI backend first.

Run from this directory:

```sh
npm ci
npm run dev
npm run test:run
npm run lint
npm run build
```

The default API address is `http://127.0.0.1:8000`. Copy `.env.example` to `.env` to override `VITE_API_BASE_URL`. Vite variables are public browser configuration; never put secrets there. Restart Vite after changing them. Local development uses port 5173, allowed by the backend CORS configuration.

Authentication state lives in `src/context`, API calls in `src/services`, guards in `src/routes` and screens in `src/pages`. The backend enforces permissions. See the root [test report](../TEST_REPORT.md) for actual results.
