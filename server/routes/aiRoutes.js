const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');

// Store conversation history (in production, use database)
const conversations = new Map();

/**
 * POST /api/ai/chat
 * Process chat message and generate rule
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get or create conversation history
    const session = sessionId || `session_${Date.now()}`;
    let history = conversations.get(session) || [];
    
    // Add user message to history
    history.push({ role: 'user', content: message });
    
    // Parse the rule from chat
    const result = await AIService.parseRuleFromChat(message, history);
    
    // Add AI response to history
    const aiResponse = result.success 
      ? `I've created a rule: ${result.explanation}` 
      : `I couldn't create that rule. ${result.suggestion}`;
    
    history.push({ role: 'assistant', content: aiResponse });
    conversations.set(session, history);
    
    res.json({
      sessionId: session,
      response: aiResponse,
      rule: result.rule,
      success: result.success,
      history: history.slice(-10) // Return last 10 messages
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

/**
 * POST /api/ai/parse-actions
 * Parse success and failure actions from message
 */
router.post('/parse-actions', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const actions = AIService.parseActions(message);
    
    res.json({
      success: true,
      actions
    });
  } catch (error) {
    console.error('Parse actions error:', error);
    res.status(500).json({ error: 'Failed to parse actions' });
  }
});

/**
 * POST /api/ai/create-workflow
 * Create a complete workflow from rules
 */
router.post('/create-workflow', async (req, res) => {
  try {
    const { workflowName, rules } = req.body;
    
    if (!workflowName || !rules || !Array.isArray(rules)) {
      return res.status(400).json({ error: 'Workflow name and rules array are required' });
    }
    
    const workflow = AIService.createWorkflow(workflowName, rules);
    
    res.json({
      success: true,
      workflow
    });
  } catch (error) {
    console.error('Create workflow error:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
});

/**
 * GET /api/ai/conversation/:sessionId
 * Get conversation history
 */
router.get('/conversation/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = conversations.get(sessionId) || [];
  
  res.json({
    sessionId,
    history
  });
});

module.exports = router;
