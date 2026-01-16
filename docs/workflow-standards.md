# n8n Workflow Standards

This document outlines best practices for creating n8n workflows that integrate well with this project's web apps.

## Webhook Configuration

### Required Setup

Every workflow must have a **Webhook** trigger node with:

- **HTTP Method**: POST (recommended)
- **Path**: Unique path for the workflow (e.g., `/my-workflow`)
- **Response Mode**: "Respond to Webhook"
- **Response Code**: 200

### Standard Response Format

All workflows should return responses in this format:

```json
{
  "success": true,
  "data": {
    // Your workflow output data
  },
  "error": null,
  "message": "Optional human-readable message"
}
```

**Success Response Example:**
```json
{
  "success": true,
  "data": {
    "result": "Text was successfully transformed",
    "wordCount": 42,
    "output": "TRANSFORMED TEXT"
  },
  "message": "Processing complete"
}
```

**Error Response Example:**
```json
{
  "success": false,
  "data": null,
  "error": "Invalid input: text field is required",
  "message": "Validation failed"
}
```

## Input Validation

### Validate Early

Add a **Function** or **Code** node at the beginning of your workflow to validate inputs:

```javascript
// Example validation in Code node
const input = $input.first().json;

if (!input.text || typeof input.text !== 'string') {
  return [{
    json: {
      success: false,
      error: "Invalid input: 'text' field is required and must be a string",
      data: null
    }
  }];
}

// Continue with valid input
return [{
  json: {
    ...input,
    validated: true
  }
}];
```

### Document Expected Inputs

In your workflow description or notes, document:
- Required fields and types
- Optional fields and defaults
- Value constraints (min/max, regex, etc.)
- Example valid input

## Error Handling

### Add Error Workflow

Configure error handling in workflow settings:
1. Settings → Error Workflow
2. Select or create an error workflow
3. Error workflow should log errors and return standard format

### Use Try-Catch Pattern

For critical operations, wrap in error handling:

```javascript
try {
  // Your workflow logic
  const result = doSomething(input);

  return [{
    json: {
      success: true,
      data: result
    }
  }];
} catch (error) {
  return [{
    json: {
      success: false,
      error: error.message,
      data: null
    }
  }];
}
```

### Handle Node Failures

Use "Continue on Fail" for nodes that might fail:
1. Select node
2. Settings → Continue on Fail → Enable
3. Add downstream logic to check for failures

## Performance Considerations

### Response Time

Web apps expect responses within **30 seconds**. For longer workflows:

**Option 1: Async Pattern**
1. Webhook accepts request, returns immediately
2. Workflow continues in background
3. Results sent via email/notification

**Option 2: Progress Updates**
1. Use WebSocket or polling for updates
2. Return initial response quickly
3. Provide status endpoint

### Optimize Nodes

- Use pagination for large datasets
- Batch API requests where possible
- Cache repeated API calls
- Limit loop iterations

## Testing Workflows

### Before Creating App

Test your workflow thoroughly:

1. **Test with curl**
   ```bash
   curl -X POST https://your-n8n.com/webhook/your-workflow \
     -H "Content-Type: application/json" \
     -d '{"input": "test data"}'
   ```

2. **Test with Postman**
   - Create collection
   - Add test cases
   - Verify response format

3. **Test error scenarios**
   - Missing required fields
   - Invalid data types
   - Edge cases
   - Timeout scenarios

4. **Document test cases**
   Add to workflow notes or description

### Validation Checklist

- [ ] Webhook node configured correctly
- [ ] Response format matches standard
- [ ] Input validation implemented
- [ ] Error handling added
- [ ] Response time < 30 seconds
- [ ] Test cases documented
- [ ] Success scenarios tested
- [ ] Error scenarios tested

## Security Best Practices

### Authentication

For workflows requiring authentication:

**Option 1: API Key in Header**
```javascript
const apiKey = $request.headers['x-api-key'];
if (apiKey !== process.env.EXPECTED_API_KEY) {
  return [{
    json: {
      success: false,
      error: "Unauthorized",
      data: null
    }
  }];
}
```

**Option 2: Webhook URL Secret**
- Use long, random webhook paths
- Treat webhook URL as secret
- Don't expose in client-side code

### Input Sanitization

Sanitize all inputs to prevent injection:

```javascript
function sanitizeInput(input) {
  // Remove dangerous characters
  return input
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}
```

### Rate Limiting

For public-facing workflows:
- Add rate limiting logic
- Track requests per IP
- Return 429 status when exceeded

## Workflow Organization

### Naming Conventions

- **Workflow Name**: Descriptive and unique (e.g., "Text Transformer")
- **Webhook Path**: Kebab-case (e.g., `/text-transformer`)
- **Node Names**: Clear and descriptive

### Documentation

In workflow description, include:
- Purpose of the workflow
- Expected inputs and outputs
- Dependencies (APIs, credentials)
- Known limitations
- Change log

### Version Control

When updating workflows:
1. Test changes in development workflow
2. Document breaking changes
3. Update app code if needed
4. Deploy workflow updates
5. Deploy app updates

## Example Workflows

### Simple Text Transformation

**Input:**
```json
{
  "text": "hello world"
}
```

**Workflow:**
1. Webhook trigger
2. Validate input
3. Transform text (uppercase)
4. Count words
5. Return response

**Output:**
```json
{
  "success": true,
  "data": {
    "original": "hello world",
    "transformed": "HELLO WORLD",
    "wordCount": 2
  }
}
```

### AI Processing Workflow

**Input:**
```json
{
  "prompt": "Explain quantum computing",
  "maxTokens": 150
}
```

**Workflow:**
1. Webhook trigger
2. Validate input
3. Call OpenAI API
4. Parse response
5. Return formatted result

**Output:**
```json
{
  "success": true,
  "data": {
    "response": "Quantum computing is...",
    "tokensUsed": 142,
    "model": "gpt-4"
  }
}
```

## Integration with Apps

### Front-End Requirements

When creating the web app:
1. Match input schema exactly
2. Handle all response fields
3. Show appropriate loading states
4. Display errors clearly
5. Provide example inputs

### API Route Setup

The app's API route proxies to n8n:
- Validates inputs before sending
- Handles timeouts gracefully
- Logs errors for debugging
- Transforms responses if needed

### Environment Variables

Configure in app's `.env.local`:
```env
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_DEV=https://dev-n8n.com/webhook
NEXT_PUBLIC_N8N_WEBHOOK_BASE_URL_PROD=https://prod-n8n.com/webhook
WORKFLOW_ID=text-transformer
```

## Troubleshooting

### Common Issues

**Workflow not responding:**
- Check webhook URL is correct
- Verify workflow is active
- Check n8n instance is running

**CORS errors:**
- Enable CORS in webhook node settings
- Allow app domain in CORS origins

**Timeout errors:**
- Optimize workflow performance
- Consider async pattern
- Check n8n execution limits

**Invalid response format:**
- Verify response matches standard format
- Check for typos in field names
- Test with curl before integrating
