const axios = require('axios');

/**
 * AI Service - Parses natural language into rule configurations
 */
class AIService {
  /**
   * Parse chat message and convert to rule JSON
   * @param {string} message - Natural language rule description
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Object} - Parsed rule configuration
   */
  static async parseRuleFromChat(message, conversationHistory = []) {
    // For demo purposes, using pattern matching instead of actual AI API
    // In production, integrate with OpenAI or similar service
    
    try {
      const rule = this.parseRuleWithPatterns(message);
      
      return {
        success: true,
        rule,
        explanation: this.explainRule(rule)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        suggestion: 'Try describing the rule with clear conditions like: "if age is greater than 40 and is_smoker equals true"'
      };
    }
  }

  /**
   * Parse rule using pattern matching (demo implementation)
   * @param {string} message - Rule description
   * @returns {Object} - Rule configuration
   */
  static parseRuleWithPatterns(message) {
    const lowerMessage = message.toLowerCase();
    
    // Detect if it's a composite rule (has AND/OR)
    const hasAnd = lowerMessage.includes(' and ');
    const hasOr = lowerMessage.includes(' or ');
    
    if (hasAnd || hasOr) {
      return this.parseCompositeRule(message, hasAnd ? 'AND' : 'OR');
    } else {
      return this.parseSimpleRule(message);
    }
  }

  /**
   * Parse a simple rule
   * @param {string} message - Rule description
   * @returns {Object} - Simple rule configuration
   */
  static parseSimpleRule(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract field
    const fieldPatterns = [
      /(?:if |when |where )?(age|is_smoker|smoker|income|salary|gender|status)/i,
      /person is (smoker)/i
    ];
    
    let field = null;
    for (const pattern of fieldPatterns) {
      const match = message.match(pattern);
      if (match) {
        field = match[1];
        if (field === 'smoker') field = 'is_smoker';
        break;
      }
    }
    
    // Extract operator and value
    let operator = '==';
    let value = null;
    
    if (lowerMessage.includes('greater than') || lowerMessage.includes('above')) {
      operator = '>';
      const match = message.match(/(?:greater than|above)\s+(\d+)/i);
      value = match ? parseInt(match[1]) : null;
    } else if (lowerMessage.includes('less than') || lowerMessage.includes('below')) {
      operator = '<';
      const match = message.match(/(?:less than|below)\s+(\d+)/i);
      value = match ? parseInt(match[1]) : null;
    } else if (lowerMessage.includes('equals') || lowerMessage.includes('is ')) {
      operator = '==';
      if (lowerMessage.includes('true') || lowerMessage.includes('smoker')) {
        value = true;
      } else if (lowerMessage.includes('false')) {
        value = false;
      } else {
        const match = message.match(/(?:equals|is)\s+(\w+)/i);
        value = match ? match[1] : null;
      }
    }
    
    if (!field) {
      throw new Error('Could not identify the field to check');
    }
    
    return {
      type: 'simple',
      field,
      operator,
      value,
      name: `${field} ${operator} ${value}`
    };
  }

  /**
   * Parse a composite rule with AND/OR
   * @param {string} message - Rule description
   * @param {string} operator - AND or OR
   * @returns {Object} - Composite rule configuration
   */
  static parseCompositeRule(message, operator) {
    const parts = message.split(new RegExp(` ${operator.toLowerCase()} `, 'i'));
    
    const rules = parts.map(part => this.parseSimpleRule(part.trim()));
    
    return {
      type: 'composite',
      operator,
      rules,
      name: `Composite rule with ${operator}`
    };
  }

  /**
   * Extract actions from message
   * @param {string} message - Message containing actions
   * @returns {Object} - Success and failure actions
   */
  static parseActions(message) {
    const lowerMessage = message.toLowerCase();
    
    let successAction = null;
    let failureAction = null;
    
    // Parse success action
    const successMatch = message.match(/on success\s+(.+?)(?:on failure|$)/i);
    if (successMatch) {
      successAction = {
        type: 'action',
        description: successMatch[1].trim()
      };
    }
    
    // Parse failure action
    const failureMatch = message.match(/on failure\s+(.+?)$/i);
    if (failureMatch) {
      failureAction = {
        type: 'action',
        description: failureMatch[1].trim()
      };
    }
    
    return { successAction, failureAction };
  }

  /**
   * Generate explanation for a rule
   * @param {Object} rule - Rule configuration
   * @returns {string} - Human-readable explanation
   */
  static explainRule(rule) {
    if (rule.type === 'simple') {
      const operatorText = {
        '>': 'is greater than',
        '<': 'is less than',
        '>=': 'is greater than or equal to',
        '<=': 'is less than or equal to',
        '==': 'equals',
        '!=': 'does not equal'
      };
      
      return `This rule checks if ${rule.field} ${operatorText[rule.operator] || rule.operator} ${rule.value}`;
    } else if (rule.type === 'composite') {
      return `This is a composite rule that requires ${rule.operator === 'AND' ? 'all' : 'at least one'} of the following conditions to be true: ${rule.rules.length} sub-rules`;
    }
    
    return 'Rule configuration';
  }

  /**
   * Create a complete workflow from chat
   * @param {string} workflowName - Name of the workflow
   * @param {Array} rules - Array of rules
   * @returns {Object} - Complete workflow configuration
   */
  static createWorkflow(workflowName, rules) {
    return {
      id: `workflow_${Date.now()}`,
      name: workflowName,
      rules: rules.map((rule, index) => ({
        ...rule,
        id: `rule_${index + 1}`,
        successAction: rule.successAction || { type: 'notify', message: 'Rule passed' },
        failureAction: rule.failureAction || { type: 'notify', message: 'Rule failed' }
      })),
      strategy: 'all',
      createdAt: new Date().toISOString()
    };
  }
}

module.exports = AIService;
