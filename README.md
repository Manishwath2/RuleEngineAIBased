# 🤖 AI-Based Rule Engine Admin Platform

An intelligent admin platform for configuring insurance rules through natural language chat interface. This system allows administrators to create simple and composite rules via conversational AI, preview generated configurations, and execute workflows with success/failure actions.

## ✨ Features

- **🎯 Natural Language Rule Configuration**: Chat with AI to create rules using plain English
- **📋 Simple & Composite Rules**: Support for both basic conditions and complex AND/OR logic
- **👁️ Real-time Preview**: See rule configurations update live as you chat
- **🔄 Workflow Management**: Create workflows with multiple rules
- **✅ Success/Failure Actions**: Define actions for rule outcomes
- **🧪 Test Execution**: Test workflows with sample data
- **📊 JSON Export**: View and export rule configurations as JSON

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Rule Engine**: Evaluates simple and composite rules against data
- **AI Service**: Parses natural language into rule configurations
- **RESTful API**: Endpoints for chat, rule evaluation, and workflow management

### Frontend (React)
- **Chat Interface**: Interactive chat UI for rule configuration
- **Rule Preview**: Visual representation of created rules
- **Workflow Manager**: Test and manage workflows
- **Responsive Design**: Modern, gradient-based UI

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Manishwath2/RuleEngineAIBased.git
cd RuleEngineAIBased
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables** (optional)
```bash
cp .env.example .env
```

4. **Run the application**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

## 📖 Usage Examples

### Creating Simple Rules

**Example 1: Age Check**
```
User: "if age is greater than 40"
AI: Creates a simple rule checking if age > 40
```

**Example 2: Smoker Status**
```
User: "if person is smoker"
AI: Creates a simple rule checking if is_smoker equals true
```

### Creating Composite Rules

**Example: Combined Conditions**
```
User: "if the person is smoker and age is above 40 then execute success action on success and failure action on failure"
AI: Creates a composite rule with AND logic:
  - Condition 1: is_smoker == true
  - Condition 2: age > 40
  - Success/Failure actions defined
```

## 🎨 Rule Types

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
      "field": "is_smoker",
      "operator": "==",
      "value": true
    },
    {
      "type": "simple",
      "field": "age",
      "operator": ">",
      "value": 40
    }
  ],
  "name": "Composite rule with AND"
}
```

## 🔌 API Endpoints

### Chat & AI
- `POST /api/ai/chat` - Send chat message and get rule configuration
- `POST /api/ai/parse-actions` - Parse success/failure actions
- `POST /api/ai/create-workflow` - Create workflow from rules
- `GET /api/ai/conversation/:sessionId` - Get conversation history

### Rule Evaluation
- `POST /api/rules/evaluate` - Evaluate a single rule
- `POST /api/rules/workflow/execute` - Execute complete workflow
- `POST /api/rules/workflow/save` - Save workflow
- `GET /api/rules/workflow/:id` - Get workflow by ID
- `GET /api/rules/workflows` - Get all workflows

## 🧪 Testing Workflows

Use the Workflow Manager to test rules with sample data:

```json
{
  "age": 45,
  "is_smoker": true,
  "income": 50000,
  "gender": "male"
}
```

The system will evaluate all rules and show:
- Which rules passed/failed
- Success/failure actions executed
- Final workflow result

## 🛠️ Technology Stack

**Backend:**
- Node.js
- Express.js
- Axios

**Frontend:**
- React 18
- CSS3 (with gradients and animations)
- Fetch API

**Rule Engine:**
- Custom rule evaluation engine
- Support for operators: ==, !=, >, <, >=, <=, contains, in
- Composite logic: AND, OR, NOT

## 📁 Project Structure

```
RuleEngineAIBased/
├── server/
│   ├── index.js                 # Server entry point
│   ├── routes/
│   │   ├── aiRoutes.js          # AI and chat endpoints
│   │   └── ruleRoutes.js        # Rule evaluation endpoints
│   └── services/
│       ├── aiService.js         # AI parsing logic
│       └── ruleEngine.js        # Rule evaluation engine
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── ChatInterface.js  # Chat UI component
│       │   ├── RulePreview.js    # Rule visualization
│       │   └── WorkflowManager.js # Workflow testing
│       ├── services/
│       │   └── ruleService.js    # API client
│       ├── styles/               # CSS files
│       ├── App.js                # Main app component
│       └── index.js              # React entry point
├── package.json
└── README.md
```

## 🎯 Use Cases

### Insurance Eligibility
Configure rules for policy eligibility based on:
- Age brackets
- Smoking status
- Health conditions
- Income levels
- Employment status

### Risk Assessment
Create workflows for:
- Premium calculation
- Coverage determination
- Application approval/rejection
- Document requirements

## 🔒 Security Note

This is a demo implementation with in-memory storage. For production use:
- Integrate with a proper database
- Add authentication and authorization
- Implement rate limiting
- Use actual AI API (OpenAI, Anthropic, etc.)
- Add input validation and sanitization
- Implement audit logging

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License

## 👨‍💻 Author

Created for insurance rule configuration automation

## 🙏 Acknowledgments

- Pattern matching for natural language processing
- React for UI components
- Express for backend API
