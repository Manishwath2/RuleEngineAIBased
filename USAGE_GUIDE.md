# 🎓 User Guide - AI Rule Configurator

## Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/Manishwath2/RuleEngineAIBased.git
cd RuleEngineAIBased

# Install all dependencies
npm run install:all
```

### Running the Application
```bash
# Start both backend and frontend (recommended)
npm run dev

# OR start them separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## Using the Chat Interface

### Creating Simple Rules

**Example 1: Age Condition**
```
You: if age is greater than 40
AI: Creates rule checking if age > 40
```

**Example 2: Smoker Status**
```
You: if person is smoker
AI: Creates rule checking if is_smoker equals true
```

**Example 3: Income Check**
```
You: if income is less than 50000
AI: Creates rule checking if income < 50000
```

### Creating Composite Rules

**Example 1: AND Logic**
```
You: if the person is smoker and age is above 40
AI: Creates composite rule requiring BOTH conditions:
    - is_smoker == true AND
    - age > 40
```

**Example 2: Multiple Conditions**
```
You: if age is greater than 30 and income is above 40000
AI: Creates composite rule with two conditions combined with AND
```

### Understanding Rule Types

#### Simple Rules
- Single condition
- Field + Operator + Value
- Example: `age > 40`

#### Composite Rules
- Multiple conditions combined
- Supports AND/OR logic
- Example: `(age > 40) AND (is_smoker = true)`

## Working with Workflows

### Creating a Workflow

1. Create one or more rules via chat
2. Enter a workflow name (e.g., "Insurance Eligibility Check")
3. Click "Create Workflow"
4. Workflow is saved with all your rules

### Testing Workflows

1. **Prepare Test Data**
   ```json
   {
     "age": 45,
     "is_smoker": true,
     "income": 60000
   }
   ```

2. **Click "Test Workflow"**
   - System evaluates all rules
   - Shows which rules passed/failed
   - Displays success/failure actions

3. **Review Results**
   - Final Result: SUCCESS or FAILURE
   - Individual rule outcomes
   - Actions executed

## Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `>` | Greater than | age > 40 |
| `<` | Less than | income < 50000 |
| `>=` | Greater or equal | age >= 18 |
| `<=` | Less or equal | score <= 100 |
| `==` | Equals | status == active |
| `!=` | Not equals | type != premium |
| `contains` | String contains | name contains "john" |
| `in` | Value in array | status in [active, pending] |

## Common Use Cases

### Insurance Eligibility
```
Rule 1: if age is between 18 and 65
Rule 2: if not smoker
Rule 3: if income is above 30000
Workflow: All rules must pass for eligibility
```

### Premium Calculation
```
Rule 1: if age is greater than 50 → add age premium
Rule 2: if smoker → add smoker premium
Rule 3: if income is less than 40000 → apply discount
```

### Risk Assessment
```
Rule 1: if age above 60 OR smoker → high risk
Rule 2: if income below 30000 → financial risk
Rule 3: if health_score less than 50 → medical risk
```

## API Integration

### Chat Endpoint
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "if age is greater than 40"}'
```

### Evaluate Rule
```bash
curl -X POST http://localhost:5000/api/rules/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "rule": {
      "type": "simple",
      "field": "age",
      "operator": ">",
      "value": 40
    },
    "data": {"age": 45}
  }'
```

### Execute Workflow
```bash
curl -X POST http://localhost:5000/api/rules/workflow/execute \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {...},
    "data": {...}
  }'
```

## Tips & Best Practices

### Rule Creation
- Be specific in your language
- Use "and" for requiring all conditions
- Use "or" for requiring any condition
- Test rules immediately after creation

### Workflow Design
- Group related rules together
- Use meaningful workflow names
- Define clear success/failure actions
- Test with edge cases

### Data Format
- Use consistent field names
- Provide all required fields
- Use appropriate data types
- Validate JSON format

## Troubleshooting

### Rule Not Created
- Check if message is clear
- Use supported operators
- Verify field names are valid
- Try simpler expressions first

### Workflow Test Failed
- Verify JSON format is correct
- Check all required fields exist
- Review rule conditions
- Examine individual rule results

### API Errors
- Ensure backend server is running
- Check port 5000 is available
- Verify request payload format
- Review server logs

## Advanced Features

### Custom Actions
Define what happens on success/failure:
```
"on success notify admin and approve application"
"on failure send rejection email and log incident"
```

### JSON Export
- View complete rule configuration
- Copy for external use
- Import into other systems
- Archive for documentation

### Workflow Strategies
- **All**: All rules must pass
- **Any**: At least one rule must pass
- **First**: Only first rule evaluated

## Example Scenarios

### Scenario 1: New Customer Onboarding
```
Step 1: Create age verification rule
Step 2: Create income verification rule
Step 3: Create credit check rule
Step 4: Combine into "Onboarding Workflow"
Step 5: Test with sample customer data
```

### Scenario 2: Premium Adjustment
```
Step 1: Create base premium rule
Step 2: Add risk factor rules (age, smoking, etc.)
Step 3: Test with different customer profiles
Step 4: Export configuration for production
```

## Support

For issues or questions:
1. Check this guide first
2. Review README.md
3. Check API documentation
4. Review example use cases

## Security Notes

- Do not expose API without authentication in production
- Validate all user inputs
- Use environment variables for sensitive config
- Implement rate limiting for API endpoints
- Review rules before production deployment
