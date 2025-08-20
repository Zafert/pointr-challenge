# Pointr Challenge Project

A comprehensive testing solution combining **UI Automation** with **RESTful API** testing for Pointr Maps CMS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Zafert/pointr-challenge.git
cd pointr-challenge
npm install
```

## 🏗️ API Setup

**⚠️ Critical**: API server must be running before test execution.

```bash
# Initialize API server
cd api
npm install
npm run dev

# Verify server status
curl http://localhost:3000/health
# Expected response: {"status": "ok"}
```

## 🧪 Testing

### Prerequisites
API server must be running in separate terminal session before test execution.

### UI Tests (Cypress)
```bash
# Interactive test runner
npm run cypress:open

# Headless execution
npm test                    # Execute smoke test suite in Chrome
npm run test:chrome        # Chrome-specific test execution
npm run test:edge          # Edge-specific test execution

# Tag-based test execution
npx cypress run --env grepTags=@smoke
npx cypress run --env grepTags=@regression
```

### API Tests
```bash
cd api
npm run test:api          # Execute comprehensive API endpoint validation suite
```

### Allure Reports
```bash
npm run allure:report     # Generate and view report
```

## 🏗️ API Endpoints

| Resource | Endpoints | Description |
|----------|-----------|-------------|
| **Sites** | `GET/POST/DELETE /api/sites` | Large locations (e.g., hospital campus) |
| **Buildings** | `GET/POST/DELETE /api/buildings` | Structures within sites |
| **Levels** | `GET/POST/DELETE /api/levels` | Floors within buildings |
| **Health** | `GET /health` | API health check |

## 🔄 CI/CD Workflows

### Available Workflows
- **Full Test Suite**: Comprehensive UI + API test execution (Push/PR to main, Manual trigger)
- **API Tests**: RESTful API endpoint validation suite (API code modifications, Manual trigger)
- **UI Tests**: Cypress E2E test automation (Cypress configuration changes, Manual trigger)

### Manual Execution
1. Navigate to **GitHub Actions** tab
2. Select target workflow
3. Click **"Run workflow"**
4. Configure parameters: Test Type, Browser (chrome/edge/both), Tags (@smoke/@regression)

### Features
- **Path-based triggers**: Selective test execution based on modified files
- **Parallel execution**: Multi-browser concurrent test execution
- **Screenshot capture**: Automatic failure state documentation
- **Artifact storage**: 30-day retention for debugging and analysis

## 🏷️ Test Tags

| Tag | Description | Use Case |
|-----|-------------|----------|
| `@smoke` | Core functionality validation | Rapid regression detection |
| `@regression` | Comprehensive test coverage | Full test suite execution |
| `@comprehensive` | Deep-dive analysis | Detailed functionality testing |

### Cypress Configuration
- **Base URL**: https://www.pointr.tech/
- **Viewport**: 1920x1080
- **Retries**: 2 attempts on failure
- **Screenshots**: Auto-captured on failures

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| **API server initialization failure** | Verify port 3000 availability: `lsof -i :3000` |
| **API test execution failure** | Validate server status: `cd api && npm run dev` |
| **Connection refused error** | Verify API endpoint accessibility: `curl http://localhost:3000/health` |
| **Browser binary not found** | Specify browser explicitly: `--browser chrome` or install required browser |
| **Screenshot artifacts missing** | Verify directory: `cypress/screenshots/` |
| **Test execution timeout** | Validate API server responsiveness and performance |