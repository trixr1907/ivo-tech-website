# QA + CI/CD Pipeline Documentation

## Overview

This document outlines the comprehensive Quality Assurance and Continuous Integration/Continuous Deployment pipeline implemented for the IVO Tech website.

## Pipeline Architecture

### 🧪 Testing Strategy

#### 1. Unit Tests (Jest + @testing-library/react)

- **Location**: `__tests__/` directory
- **Configuration**: `jest.config.js`, `jest.setup.js`
- **Coverage**: 80% threshold for branches, functions, lines, and statements
- **Mocking**: Complete WebGL, Three.js, Next.js router, and API mocking
- **Command**: `pnpm test:ci`

#### 2. Visual Regression Testing (Chromatic)

- **Platform**: Chromatic.com
- **Configuration**: `chromatic.config.json`
- **Stories**: Storybook stories in `**/*.stories.ts` files
- **Features**:
  - Automatic visual diff detection
  - Component isolation testing
  - Cross-browser visual consistency
  - Auto-accept changes on main branch
- **Command**: `pnpm chromatic`

#### 3. End-to-End Testing (Playwright)

- **Location**: `e2e/` directory
- **Configuration**: `playwright.config.ts`
- **Features**:
  - Multi-browser testing (Chromium, Firefox, WebKit)
  - Mobile device testing
  - WebGL stub for headless 3D testing
  - Screenshot and video capture on failure
  - Performance testing capabilities
- **Command**: `pnpm test:e2e`

### 🏗️ Build Pipeline

#### GitHub Actions Workflow (`.github/workflows/deploy.yml`)

##### Stage 1: Quality Checks

- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Format checking with 2-space indentation
- **TypeScript**: Strict type checking
- **Jest**: Unit tests with coverage reporting
- **Build**: Next.js build verification

##### Stage 2: Visual Regression

- **Chromatic**: Visual regression testing
- **Dependency**: Requires quality checks to pass
- **Environment**: CHROMATIC_PROJECT_TOKEN secret

##### Stage 3: E2E Tests

- **Playwright**: End-to-end testing across browsers
- **WebGL Support**: Hardware-accelerated graphics stubbing
- **Mobile Testing**: Responsive design validation
- **Dependency**: Requires quality checks to pass

##### Stage 4: Deployment

- **Preview Deploy**: Pull requests → Vercel preview
- **Production Deploy**: Main branch → Vercel production
- **Dependencies**: All previous stages must pass

## 🛠️ Setup Instructions

### 1. Local Development

```bash
# Install dependencies
pnpm install

# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run Storybook
pnpm storybook

# Run visual regression tests
pnpm chromatic
```

### 2. Environment Variables

Copy `.env.example` and configure:

```bash
# Testing
CHROMATIC_PROJECT_TOKEN=chpt_your_token_here
BASE_URL=http://localhost:3000

# Deployment
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
VERCEL_TOKEN=your_vercel_token
```

### 3. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

- `CHROMATIC_PROJECT_TOKEN`: From Chromatic.com project
- `VERCEL_ORG_ID`: From Vercel account settings
- `VERCEL_PROJECT_ID`: From Vercel project settings
- `VERCEL_TOKEN`: From Vercel account tokens

## 🎯 Testing Standards

### Unit Tests

- Minimum 80% code coverage
- Mock all external dependencies (WebGL, APIs, etc.)
- Test component logic, not implementation details
- Use React Testing Library best practices

### Visual Tests

- Create stories for all UI components
- Test different component states and variants
- Include responsive breakpoints
- Document component APIs with Storybook

### E2E Tests

- Test critical user journeys
- Validate 3D interactions (with WebGL stubbing)
- Test across multiple browsers and devices
- Include performance assertions where applicable

## 🚀 Deployment Process

### Pull Request Flow

1. Developer creates PR
2. Quality checks run automatically
3. Visual regression tests detect UI changes
4. E2E tests validate functionality
5. Preview deployment created on Vercel
6. Code review and approval
7. Merge to main triggers production deployment

### Production Deployment

1. All tests must pass
2. Vercel production build
3. Automatic deployment to live site
4. Post-deployment notifications

## 📊 Monitoring & Reporting

### Test Reports

- Jest: HTML coverage reports
- Playwright: HTML test reports with screenshots/videos
- Chromatic: Visual diff reports with approval workflow

### CI/CD Dashboard

- GitHub Actions: Build status and logs
- Vercel: Deployment status and logs
- Chromatic: Visual regression tracking

## 🔧 Maintenance

### Regular Tasks

- Update dependencies monthly
- Review and update test coverage
- Monitor E2E test stability
- Clean up old Chromatic builds

### Performance Optimization

- Use parallel test execution
- Cache dependencies in CI
- Optimize WebGL stubbing for faster E2E tests
- Monitor build times and optimize as needed

## 🆘 Troubleshooting

### Common Issues

#### WebGL Tests Failing

- Check WebGL stubbing configuration in `playwright.config.ts`
- Verify Three.js mocks in `jest.setup.js`
- Ensure headless browser flags are correct

#### Visual Regression False Positives

- Check Chromatic threshold settings
- Review font rendering differences across environments
- Verify Storybook configuration matches production

#### E2E Tests Timing Out

- Increase timeout values in Playwright config
- Add proper wait conditions for 3D content loading
- Check network conditions in CI environment

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Playwright Documentation](https://playwright.dev/)
- [Storybook Documentation](https://storybook.js.org/)
- [Chromatic Documentation](https://docs.chromatic.com/)
- [Vercel Documentation](https://vercel.com/docs)
