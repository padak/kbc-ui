.PHONY: help dev build start lint test clean install sync-design commit

# Default target
help:
	@echo "Keboola Connection UI - Development Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  make dev           - Start development server"
	@echo "  make build         - Build production bundle"
	@echo "  make start         - Start production server"
	@echo "  make lint          - Run ESLint"
	@echo "  make install       - Install dependencies"
	@echo "  make clean         - Remove build artifacts and dependencies"
	@echo "  make sync-design   - Sync design tokens from design-system.html to app"
	@echo "  make commit        - Stage and commit changes (prompts for message)"
	@echo "  make design-preview- Open design system in browser"
	@echo ""

# Development
dev:
	@echo "Starting development server..."
	pnpm dev

build:
	@echo "Building production bundle..."
	pnpm build

start:
	@echo "Starting production server..."
	pnpm start

# Code Quality
lint:
	@echo "Running linter..."
	pnpm lint

# Dependencies
install:
	@echo "Installing dependencies..."
	pnpm install

clean:
	@echo "Cleaning build artifacts..."
	rm -rf node_modules .next out dist
	@echo "Done! Run 'make install' to reinstall dependencies."

# Design System
sync-design:
	@echo "🎨 Syncing design tokens from design-system.html..."
	@echo ""
	node scripts/sync-design-tokens.js

design-preview:
	@echo "Opening design system in browser..."
	open design-system.html || xdg-open design-system.html || start design-system.html

# Git helpers
commit:
	@echo "Staging all changes..."
	git add .
	@echo ""
	@read -p "Commit message: " msg; \
	git commit -m "$$msg"
	@echo ""
	@echo "✅ Changes committed!"
	@echo "Run 'git push' to push to remote."

# Quick shortcuts
.PHONY: d b l i c
d: dev
b: build
l: lint
i: install
c: clean
