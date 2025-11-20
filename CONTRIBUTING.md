# Contributing to VocaVision

First off, thank you for considering contributing to VocaVision! It's people like you that make VocaVision such a great tool for English vocabulary learning.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Your First Code Contribution

Unsure where to begin? You can start by looking through issues labeled:

- `good-first-issue` - Issues that are good for newcomers
- `help-wanted` - Issues that need assistance

### Pull Requests

- Fill in the required template
- Follow the coding guidelines
- Include appropriate test coverage
- Update documentation as needed
- End all files with a newline

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Setup Steps

1. **Fork and Clone**

```bash
git clone https://github.com/YOUR_USERNAME/vocavision.git
cd vocavision
```

2. **Install Dependencies**

```bash
# Backend
cd backend
npm install

# Web Frontend
cd ../web
npm install
```

3. **Environment Configuration**

```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp web/.env.example web/.env

# Edit with your local configuration
```

4. **Database Setup**

```bash
cd backend

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed
```

5. **Start Development Servers**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd web
npm run dev
```

### Docker Setup (Alternative)

```bash
# Start all services
docker compose up -d

# Run migrations
docker compose exec backend npx prisma migrate dev

# Seed database
docker compose exec backend npx prisma db seed
```

## Pull Request Process

### Before Submitting

1. **Create a Branch**

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

2. **Make Your Changes**

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation

3. **Run Tests**

```bash
# Backend tests
cd backend
npm test

# Frontend E2E tests
cd web
npm run test:e2e
```

4. **Run Linters**

```bash
# Backend
cd backend
npm run lint

# Frontend
cd web
npm run lint
```

5. **Commit Your Changes**

```bash
git add .
git commit -m "feat: add amazing feature"
```

### Submitting the Pull Request

1. Push to your fork

```bash
git push origin feature/amazing-feature
```

2. Open a Pull Request on GitHub

3. Fill out the PR template completely

4. Link any related issues

5. Wait for review

### PR Review Process

- At least one maintainer review is required
- All CI checks must pass
- All conversations must be resolved
- Keep your PR focused and small when possible
- Be responsive to feedback

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type unless absolutely necessary
- Use interfaces for object types
- Use enums for fixed sets of values

```typescript
//  Good
interface User {
  id: string;
  email: string;
  name: string;
}

// L Bad
const user: any = {
  id: '1',
  email: 'test@example.com'
};
```

### Naming Conventions

- **Files**: kebab-case (e.g., `user-controller.ts`)
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Interfaces**: PascalCase with 'I' prefix optional (e.g., `User` or `IUser`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Maximum line length: 100 characters
- Use arrow functions for callbacks

```typescript
//  Good
const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

// L Bad
function getUserById(id) {
  return prisma.user.findUnique({where: {id: id}})
}
```

### React/Next.js Conventions

- Use functional components with hooks
- Use proper TypeScript typing for props
- Extract reusable logic into custom hooks
- Keep components focused and small

```typescript
//  Good
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
};
```

## Testing Guidelines

### Unit Tests (Backend)

- Test file name: `*.test.ts`
- One test file per source file
- Test both success and error cases
- Mock external dependencies

```typescript
describe('AuthController', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const mockUser = { email: 'test@example.com', password: 'pass123' };

      // Act
      const result = await register(mockUser);

      // Assert
      expect(result.email).toBe(mockUser.email);
    });
  });
});
```

### E2E Tests (Frontend)

- Test file name: `*.spec.ts`
- Test user workflows, not implementation
- Use page object pattern for complex tests
- Mock API responses when possible

```typescript
test('user can login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

### Test Coverage

- Aim for 80%+ coverage for new code
- All new features must include tests
- Critical paths require comprehensive testing

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh to improve user experience
and reduce re-authentication frequency.

Closes #123
```

```bash
fix(dashboard): correct streak calculation logic

The streak counter was incorrectly resetting at midnight UTC
instead of user's local timezone.

Fixes #456
```

```bash
docs(readme): update installation instructions

Add Docker setup instructions and troubleshooting section.
```

### Scope

The scope should be the area of the codebase affected:

- `auth` - Authentication related
- `api` - API changes
- `ui` - UI components
- `db` - Database related
- `test` - Testing related
- `docs` - Documentation

## Project Structure

When adding new files, follow the existing structure:

```
backend/
   src/
      controllers/    # Business logic
      routes/         # API routes
      middleware/     # Express middleware
      services/       # External services
      utils/          # Helper functions
   prisma/
       migrations/     # Database migrations

web/
   src/
      app/           # Next.js pages (App Router)
      components/    # Reusable components
      lib/           # Utilities and helpers
      hooks/         # Custom React hooks
   e2e/               # E2E tests
```

## Questions?

Feel free to:

- Open a GitHub issue
- Start a discussion in GitHub Discussions
- Reach out via email: contribute@vocavision.com

## Recognition

Contributors will be recognized in:

- The project README
- Release notes for features
- Our Hall of Fame (coming soon)

Thank you for contributing to VocaVision! <‰
