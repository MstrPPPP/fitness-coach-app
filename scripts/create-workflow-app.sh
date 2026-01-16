#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./scripts/create-workflow-app.sh <workflow-name>"
  echo "Example: ./scripts/create-workflow-app.sh my-workflow"
  exit 1
fi

WORKFLOW_NAME=$1
APP_DIR="apps/${WORKFLOW_NAME}"

if [ -d "$APP_DIR" ]; then
  echo "Error: App directory ${APP_DIR} already exists"
  exit 1
fi

echo "Creating new workflow app: ${WORKFLOW_NAME}"

# Copy template
cp -r templates/workflow-app "$APP_DIR"

# Replace placeholders in package.json
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/{{WORKFLOW_NAME}}/${WORKFLOW_NAME}/g" "${APP_DIR}/package.json"
else
  # Linux
  sed -i "s/{{WORKFLOW_NAME}}/${WORKFLOW_NAME}/g" "${APP_DIR}/package.json"
fi

echo "✅ Created new app at ${APP_DIR}"
echo ""
echo "Next steps:"
echo "  1. cd ${APP_DIR}"
echo "  2. cp .env.example .env.local"
echo "  3. Update .env.local with your n8n webhook URL"
echo "  4. pnpm install (from project root)"
echo "  5. pnpm --filter ${WORKFLOW_NAME} dev"
