# Local Testing Setup

This document explains how to run the regression test suite locally.

## Prerequisites

1. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Environment Configuration

The test suite supports multiple environments:
- **ST** (System Testing)
- **UAT** (User Acceptance Testing)
- **Pre-prod** (Pre-production)

### Setting Up Environment Files

Create the following files locally (they are gitignored):

**`packages/client/.env.st`**
```
VITE_SUPABASE_URL=https://your-st-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-st-anon-key
VITE_API_URL=https://st-api.yourdomain.com
```

**`packages/client/.env.uat`**
```
VITE_SUPABASE_URL=https://your-uat-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-uat-anon-key
VITE_API_URL=https://uat-api.yourdomain.com
```

**`packages/client/.env.preprod`**
```
VITE_SUPABASE_URL=https://your-preprod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-preprod-anon-key
VITE_API_URL=https://preprod-api.yourdomain.com
```

## Running Tests

### Run ST Environment Tests
```bash
npx playwright test --project=st
```

### Run UAT Environment Tests
```bash
npx playwright test --project=uat
```

### Run Pre-prod Environment Tests
```bash
npx playwright test --project=preprod
```

### Run Performance Tests
```bash
npx playwright test --project=performance
```

### Run All Tests
```bash
npx playwright test
```

## Test Reports

Test reports are generated locally and are **not committed** to the repository:
- `st_report.json` - ST test results
- `uat_report.json` - UAT test results
- `performance_report.json` - Performance test results
- `playwright-report/` - HTML reports

To view the HTML report:
```bash
npx playwright show-report
```

## Test Structure

```
tests/
├── e2e/
│   ├── functional/
│   │   ├── auth.spec.ts
│   │   ├── booking.spec.ts
│   │   └── profile.spec.ts
│   └── performance/
│       └── load.spec.ts
└── example.spec.ts
```

## Notes

- All test reports and environment files are gitignored
- Update your local `.env.*` files with actual environment URLs
- The test suite is designed to run locally before pushing to production
