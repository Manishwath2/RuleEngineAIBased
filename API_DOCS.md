# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Health Check

#### GET /health
Check if server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Rule Engine AI Server Running"
}
```

---

## AI Endpoints

### POST /ai/chat
Process natural language message and create rule.

**Request Body:**
```json
{
  "message": "if age is greater than 40",
  "sessionId": "session_123" // optional
}
```

**Response:**
```json
{
  "sessionId": "session_123",
  "response": "I've created a rule: This rule checks if age is greater than 40",
  "rule": {
    "type": "simple",
    "field": "age",
    "operator": ">",
    "value": 40,
    "name": "age > 40"
  },
  "success": true,
  "history": [...]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Could not identify the field to check",
  "suggestion": "Try describing the rule with clear conditions..."
}
```

---

### POST /ai/parse-actions
Extract success and failure actions from message.

**Request Body:**
```json
{
  "message": "on success notify admin on failure send email"
}
```

**Response:**
```json
{
  "success": true,
  "actions": {
    "successAction": {
      "type": "action",
      "description": "notify admin"
    },
    "failureAction": {
      "type": "action",
      "description": "send email"
    }
  }
}
```

---

### POST /ai/create-workflow
Create a complete workflow from rules.

**Request Body:**
```json
{
  "workflowName": "Insurance Eligibility",
  "rules": [
    {
      "type": "simple",
      "field": "age",
      "operator": ">",
      "value": 40
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "workflow_1234567890",
    "name": "Insurance Eligibility",
    "rules": [...],
    "strategy": "all",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### GET /ai/conversation/:sessionId
Retrieve conversation history.

**Response:**
```json
{
  "sessionId": "session_123",
  "history": [
    {
      "role": "user",
      "content": "if age is greater than 40"
    },
    {
      "role": "assistant",
      "content": "I've created a rule..."
    }
  ]
}
```

---

## Rule Endpoints

### POST /rules/evaluate
Evaluate a single rule against data.

**Request Body:**
```json
{
  "rule": {
    "type": "simple",
    "field": "age",
    "operator": ">",
    "value": 40
  },
  "data": {
    "age": 45
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": true,
  "rule": {...},
  "data": {...}
}
```

---

### POST /rules/workflow/execute
Execute complete workflow with multiple rules.

**Request Body:**
```json
{
  "workflow": {
    "id": "workflow_123",
    "name": "Insurance Check",
    "rules": [
      {
        "id": "rule_1",
        "name": "Age Check",
        "type": "simple",
        "field": "age",
        "operator": ">",
        "value": 40,
        "successAction": {
          "type": "notify",
          "message": "Age requirement met"
        },
        "failureAction": {
          "type": "notify",
          "message": "Age requirement not met"
        }
      }
    ],
    "strategy": "all"
  },
  "data": {
    "age": 45
  }
}
```

**Response:**
```json
{
  "success": true,
  "execution": {
    "workflowId": "workflow_123",
    "workflowName": "Insurance Check",
    "results": [
      {
        "ruleId": "rule_1",
        "ruleName": "Age Check",
        "evaluation": true,
        "successAction": {
          "type": "notify",
          "message": "Age requirement met"
        },
        "failureAction": null
      }
    ],
    "finalResult": "success"
  }
}
```

---

### POST /rules/workflow/save
Save a workflow configuration.

**Request Body:**
```json
{
  "workflow": {
    "id": "workflow_123",
    "name": "My Workflow",
    "rules": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow saved successfully",
  "workflowId": "workflow_123"
}
```

---

### GET /rules/workflow/:id
Get a specific workflow by ID.

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "workflow_123",
    "name": "My Workflow",
    "rules": [...]
  }
}
```

**Error Response (404):**
```json
{
  "error": "Workflow not found"
}
```

---

### GET /rules/workflows
Get all saved workflows.

**Response:**
```json
{
  "success": true,
  "workflows": [...],
  "count": 5
}
```

---

## Rule Schema

### Simple Rule
```json
{
  "type": "simple",
  "field": "age",
  "operator": ">",
  "value": 40,
  "name": "age > 40"
}
```

### Composite Rule
```json
{
  "type": "composite",
  "operator": "AND",
  "rules": [
    {
      "type": "simple",
      "field": "age",
      "operator": ">",
      "value": 40
    },
    {
      "type": "simple",
      "field": "is_smoker",
      "operator": "==",
      "value": true
    }
  ],
  "name": "Composite rule with AND"
}
```

---

## Supported Operators

- `==` or `equals`: Equal to
- `!=` or `not_equals`: Not equal to
- `>` or `greater_than`: Greater than
- `>=` or `greater_than_or_equals`: Greater than or equal
- `<` or `less_than`: Less than
- `<=` or `less_than_or_equals`: Less than or equal
- `contains`: String contains (case-insensitive)
- `in`: Value in array

---

## Composite Operators

- `AND`: All sub-rules must be true
- `OR`: At least one sub-rule must be true
- `NOT`: Negates the sub-rule

---

## Workflow Strategies

- `all`: All rules must pass (default)
- `any`: At least one rule must pass
- `first`: Only first rule is evaluated

---

## Error Codes

- `400`: Bad Request - Missing or invalid parameters
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side issue

---

## Rate Limiting

Currently no rate limiting implemented. For production use, implement rate limiting middleware.

---

## Authentication

Currently no authentication required. For production use, implement JWT or similar authentication.

---

## Examples with cURL

### Create Simple Rule
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "if age is greater than 40"
  }'
```

### Evaluate Composite Rule
```bash
curl -X POST http://localhost:5000/api/rules/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "rule": {
      "type": "composite",
      "operator": "AND",
      "rules": [
        {"type": "simple", "field": "age", "operator": ">", "value": 40},
        {"type": "simple", "field": "is_smoker", "operator": "==", "value": true}
      ]
    },
    "data": {
      "age": 45,
      "is_smoker": true
    }
  }'
```

### Execute Workflow
```bash
curl -X POST http://localhost:5000/api/rules/workflow/execute \
  -H "Content-Type: application/json" \
  -d @workflow.json
```

---

## WebSocket Support

Currently not implemented. For real-time updates, consider adding Socket.io integration.

---

## Production Considerations

1. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Authentication**: Implement JWT authentication
3. **Rate Limiting**: Add express-rate-limit
4. **Validation**: Use Joi or express-validator
5. **Logging**: Implement Winston or similar
6. **Monitoring**: Add health checks and metrics
7. **CORS**: Configure CORS properly for production domains
8. **HTTPS**: Use HTTPS in production
