/**
 * Rule Engine - Evaluates simple and composite rules
 */
class RuleEngine {
  /**
   * Evaluate a rule against provided data
   * @param {Object} rule - The rule to evaluate
   * @param {Object} data - The data to evaluate against
   * @returns {boolean} - Result of evaluation
   */
  static evaluate(rule, data) {
    if (!rule || !rule.type) {
      return false;
    }

    if (rule.type === 'simple') {
      return this.evaluateSimpleRule(rule, data);
    } else if (rule.type === 'composite') {
      return this.evaluateCompositeRule(rule, data);
    }

    return false;
  }

  /**
   * Evaluate a simple rule
   * @param {Object} rule - Simple rule with field, operator, value
   * @param {Object} data - Data object
   * @returns {boolean}
   */
  static evaluateSimpleRule(rule, data) {
    const { field, operator, value } = rule;
    const fieldValue = data[field];

    switch (operator) {
      case '==':
      case 'equals':
        return fieldValue == value;
      case '!=':
      case 'not_equals':
        return fieldValue != value;
      case '>':
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      case '>=':
      case 'greater_than_or_equals':
        return Number(fieldValue) >= Number(value);
      case '<':
      case 'less_than':
        return Number(fieldValue) < Number(value);
      case '<=':
      case 'less_than_or_equals':
        return Number(fieldValue) <= Number(value);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      default:
        return false;
    }
  }

  /**
   * Evaluate a composite rule (with AND/OR logic)
   * @param {Object} rule - Composite rule with operator and rules array
   * @param {Object} data - Data object
   * @returns {boolean}
   */
  static evaluateCompositeRule(rule, data) {
    const { operator, rules } = rule;

    if (!Array.isArray(rules) || rules.length === 0) {
      return false;
    }

    if (operator === 'AND') {
      return rules.every(r => this.evaluate(r, data));
    } else if (operator === 'OR') {
      return rules.some(r => this.evaluate(r, data));
    } else if (operator === 'NOT') {
      return !this.evaluate(rules[0], data);
    }

    return false;
  }

  /**
   * Execute workflow with multiple rules
   * @param {Object} workflow - Workflow configuration
   * @param {Object} data - Data to evaluate
   * @returns {Object} - Execution result with actions
   */
  static executeWorkflow(workflow, data) {
    const results = [];
    
    for (const rule of workflow.rules) {
      const evaluation = this.evaluate(rule, data);
      
      results.push({
        ruleId: rule.id || rule.name,
        ruleName: rule.name,
        evaluation,
        successAction: evaluation ? rule.successAction : null,
        failureAction: !evaluation ? rule.failureAction : null
      });
    }

    return {
      workflowId: workflow.id,
      workflowName: workflow.name,
      results,
      finalResult: this.determineFinalResult(workflow, results)
    };
  }

  /**
   * Determine final workflow result based on strategy
   * @param {Object} workflow - Workflow configuration
   * @param {Array} results - Individual rule results
   * @returns {string} - Final result
   */
  static determineFinalResult(workflow, results) {
    const strategy = workflow.strategy || 'all';
    
    if (strategy === 'all') {
      return results.every(r => r.evaluation) ? 'success' : 'failure';
    } else if (strategy === 'any') {
      return results.some(r => r.evaluation) ? 'success' : 'failure';
    } else if (strategy === 'first') {
      return results[0]?.evaluation ? 'success' : 'failure';
    }
    
    return 'unknown';
  }
}

module.exports = RuleEngine;
