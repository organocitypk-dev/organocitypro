---
name: organocitypro
description: AI development rules and coding standards for OrganocityPro
---

# OrganocityPro AI Development Skill

This skill defines the development standards, architecture rules, optimization practices, and safety guidelines for the OrganocityPro project.

## When to use

Use this skill when:
- Creating new features
- Updating components
- Refactoring code
- Working with APIs
- Updating database logic
- Improving UI/UX
- Optimizing performance
- Fixing bugs
- Improving security

## Core Development Rules

### Project Safety

- Never reset the database
- Never delete production data
- Never run seed scripts unless explicitly requested
- Never modify unrelated functionality
- Do not break existing features
- Preserve current business logic
- Avoid unnecessary file changes

### Task Execution Process

1. First analyze the application structure
2. Understand the existing functionality
3. Identify dependencies before making changes
4. Make only task-specific updates
5. Keep changes isolated and controlled
6. Test for side effects before finalizing

### Code Structure

- Keep code clean and well-structured
- Use reusable components
- Reduce code duplication
- Follow modular architecture
- Keep components small and maintainable
- Use meaningful naming conventions
- Separate business logic from UI logic

### Frontend Rules

- Use Next.js native features and components whenever possible
- Use Tailwind CSS for styling
- Avoid unnecessary UI libraries
- If functionality can be built with Tailwind CSS, do not install additional libraries
- Keep the UI fully mobile responsive
- Maintain responsive layouts for all screen sizes
- Follow clean and modern UI practices

### Performance Optimization

- Optimize for performance and scalability
- Reduce bundle size and unnecessary dependencies
- Avoid heavy libraries unless required
- Use dynamic imports where beneficial
- Minimize unnecessary re-renders
- Keep pages lightweight and fast

### Security Rules

- Apply security best practices
- Validate all inputs
- Sanitize user data
- Protect API routes
- Avoid exposing sensitive data
- Use secure authentication and authorization patterns
- Prevent unnecessary client-side exposure

### Backend & Database Rules

- Keep database queries optimized
- Avoid unnecessary database calls
- Use proper error handling
- Maintain clean API structure
- Preserve existing schema relationships
- Do not alter database structure unnecessarily

### Development Standards

- Use TypeScript best practices
- Keep strict typing where possible
- Use async/await properly
- Write maintainable and scalable code
- Follow consistent formatting and architecture

### Important Restrictions

- Do not change unrelated code
- Do not modify existing functionality unless required
- Do not introduce breaking changes
- Do not install unnecessary packages
- Do not over-engineer solutions
- Focus only on the provided task and related components