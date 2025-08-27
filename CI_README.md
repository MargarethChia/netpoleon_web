# 🚀 CI/CD & Development Workflow

This document explains the CI/CD pipeline, commit conventions, and development workflow for the Netpoleon web application.

## 📋 Table of Contents

- [CI/CD Pipeline](#cicd-pipeline)
- [Commit Conventions](#commit-conventions)
- [Development Workflow](#development-workflow)
- [Available Scripts](#available-scripts)
- [Git Hooks](#git-hooks)
- [Troubleshooting](#troubleshooting)

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI Workflow (`.github/workflows/ci.yml`)

- **Triggers**: Push to `main`/`develop` branches, Pull Requests
- **Runs on**: Ubuntu with Node.js 18.x and 20.x
- **Steps**:
  - Checkout code
  - Install dependencies
  - Run linting (`npm run lint`)
  - Run tests with coverage (`npm run test:coverage`)
  - Build application (`npm run build`)
  - Upload coverage reports to Codecov

#### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

- **Triggers**: Push to `main` branch, Manual dispatch
- **Runs on**: Ubuntu with Node.js 20.x
- **Steps**:
  - All CI steps (lint, test, build)
  - Deploy to Vercel production

### Required Secrets

Set these secrets in your GitHub repository:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_ANON_KEY=your_supabase_anon_key

# Codecov (optional)
CODECOV_TOKEN=your_codecov_token

# Vercel (for deployment)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

## 📝 Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent commit messages.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **`feat`**: New feature
- **`fix`**: Bug fix
- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, semicolons, etc.)
- **`refactor`**: Code refactoring
- **`perf`**: Performance improvements
- **`test`**: Adding or updating tests
- **`chore`**: Maintenance tasks, dependencies, etc.
- **`ci`**: CI/CD changes
- **`build`**: Build system changes
- **`revert`**: Revert previous commit

### Examples

```bash
# Feature
feat: add vendor portfolio PDF download functionality

# Bug fix
fix: resolve authentication issue in image upload

# Documentation
docs: update API documentation with new endpoints

# Style
style: format code with prettier

# Refactor
refactor: simplify vendor data fetching logic

# Test
test: add unit tests for vendor API functions

# Chore
chore: update dependencies and dev tools
```

## 🛠️ Development Workflow

### 1. Setup (First Time)

```bash
# Install dependencies
npm install

# Setup Husky hooks
npm run prepare
```

### 2. Daily Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Check linting
npm run lint

# Format code
npm run format
```

### 3. Before Committing

```bash
# Interactive commit (recommended)
npm run commit

# Or manual commit with conventional format
git add .
git commit -m "feat: add new feature description"
```

### 4. Before Pushing

```bash
# Ensure all checks pass
npm run lint
npm run test
npm run build
```

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting

# Testing
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Git Hooks
npm run prepare          # Setup Husky hooks
npm run commit           # Interactive commit with Commitizen
```

## 🪝 Git Hooks

### Pre-commit Hook

- Runs `lint-staged` to check and format staged files
- Ensures code quality before commits

### Lint-staged Configuration

- Runs ESLint and Prettier on staged files
- Automatically fixes formatting issues
- Supports: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.md`, `.yml`, `.yaml`, `.css`, `.scss`

## 🔧 Configuration Files

- **`.eslintrc.js`**: ESLint configuration
- **`.prettierrc`**: Prettier formatting rules
- **`.lintstagedrc.js`**: Lint-staged configuration

- **`.husky/`**: Git hooks configuration

## 🚨 Troubleshooting

### Common Issues

#### 1. Husky Hooks Not Working

```bash
# Reinstall Husky
npm run prepare

# Check if hooks are executable
ls -la .husky/
```

#### 2. Commit Message Rejected

```bash
# Use interactive commit
npm run commit

# Or follow conventional format
git commit -m "type: description"
```

#### 3. Linting Errors

```bash
# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

#### 4. CI Pipeline Failing

- Check GitHub Actions logs
- Ensure all tests pass locally: `npm run test`
- Verify build works: `npm run build`
- Check environment variables in GitHub secrets

### Getting Help

1. Check GitHub Actions logs for detailed error messages
2. Run commands locally to reproduce issues
3. Review configuration files for syntax errors
4. Check dependency versions and compatibility

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint Rules](https://commitlint.js.org/#/reference-rules)
- [Lint-staged Configuration](https://github.com/okonet/lint-staged)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
