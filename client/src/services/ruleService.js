import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class RuleService {
  /**
   * Send a chat message to AI
   */
  static async sendChatMessage(message, sessionId = null) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message,
        sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  /**
   * Parse actions from message
   */
  static async parseActions(message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/parse-actions`, {
        message
      });
      return response.data;
    } catch (error) {
      console.error('Parse actions error:', error);
      throw error;
    }
  }

  /**
   * Create a workflow
   */
  static async createWorkflow(workflowName, rules) {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/create-workflow`, {
        workflowName,
        rules
      });
      return response.data;
    } catch (error) {
      console.error('Create workflow error:', error);
      throw error;
    }
  }

  /**
   * Evaluate a rule
   */
  static async evaluateRule(rule, data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rules/evaluate`, {
        rule,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Evaluate rule error:', error);
      throw error;
    }
  }

  /**
   * Execute a workflow
   */
  static async executeWorkflow(workflow, data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rules/workflow/execute`, {
        workflow,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Execute workflow error:', error);
      throw error;
    }
  }

  /**
   * Save a workflow
   */
  static async saveWorkflow(workflow) {
    try {
      const response = await axios.post(`${API_BASE_URL}/rules/workflow/save`, {
        workflow
      });
      return response.data;
    } catch (error) {
      console.error('Save workflow error:', error);
      throw error;
    }
  }

  /**
   * Get all workflows
   */
  static async getWorkflows() {
    try {
      const response = await axios.get(`${API_BASE_URL}/rules/workflows`);
      return response.data;
    } catch (error) {
      console.error('Get workflows error:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  static async getConversation(sessionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/ai/conversation/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  }
}

export default RuleService;
