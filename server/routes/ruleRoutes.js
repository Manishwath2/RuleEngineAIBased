const express = require('express');
const router = express.Router();
const RuleEngine = require('../services/ruleEngine');

// Store rules and workflows (in production, use database)
const workflows = new Map();

/**
 * POST /api/rules/evaluate
 * Evaluate a single rule against data
 */
router.post('/evaluate', (req, res) => {
  try {
    const { rule, data } = req.body;
    
    if (!rule || !data) {
      return res.status(400).json({ error: 'Rule and data are required' });
    }
    
    const result = RuleEngine.evaluate(rule, data);
    
    res.json({
      success: true,
      result,
      rule,
      data
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Failed to evaluate rule' });
  }
});

/**
 * POST /api/rules/workflow/execute
 * Execute a complete workflow
 */
router.post('/workflow/execute', (req, res) => {
  try {
    const { workflow, data } = req.body;
    
    if (!workflow || !data) {
      return res.status(400).json({ error: 'Workflow and data are required' });
    }
    
    const result = RuleEngine.executeWorkflow(workflow, data);
    
    res.json({
      success: true,
      execution: result
    });
  } catch (error) {
    console.error('Workflow execution error:', error);
    res.status(500).json({ error: 'Failed to execute workflow' });
  }
});

/**
 * POST /api/rules/workflow/save
 * Save a workflow
 */
router.post('/workflow/save', (req, res) => {
  try {
    const { workflow } = req.body;
    
    if (!workflow || !workflow.id) {
      return res.status(400).json({ error: 'Valid workflow with ID is required' });
    }
    
    workflows.set(workflow.id, workflow);
    
    res.json({
      success: true,
      message: 'Workflow saved successfully',
      workflowId: workflow.id
    });
  } catch (error) {
    console.error('Save workflow error:', error);
    res.status(500).json({ error: 'Failed to save workflow' });
  }
});

/**
 * GET /api/rules/workflow/:id
 * Get a workflow by ID
 */
router.get('/workflow/:id', (req, res) => {
  try {
    const { id } = req.params;
    const workflow = workflows.get(id);
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json({
      success: true,
      workflow
    });
  } catch (error) {
    console.error('Get workflow error:', error);
    res.status(500).json({ error: 'Failed to get workflow' });
  }
});

/**
 * GET /api/rules/workflows
 * Get all workflows
 */
router.get('/workflows', (req, res) => {
  try {
    const allWorkflows = Array.from(workflows.values());
    
    res.json({
      success: true,
      workflows: allWorkflows,
      count: allWorkflows.length
    });
  } catch (error) {
    console.error('Get workflows error:', error);
    res.status(500).json({ error: 'Failed to get workflows' });
  }
});

module.exports = router;
