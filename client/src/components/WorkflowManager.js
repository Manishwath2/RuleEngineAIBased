import React, { useState } from 'react';
import '../styles/WorkflowManager.css';

const WorkflowManager = ({ rules, onWorkflowCreated }) => {
  const [workflowName, setWorkflowName] = useState('');
  const [testData, setTestData] = useState('{\n  "age": 45,\n  "is_smoker": true\n}');
  const [testResult, setTestResult] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleCreateWorkflow = async () => {
    if (!workflowName.trim() || rules.length === 0) {
      alert('Please provide a workflow name and at least one rule');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/ai/create-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowName: workflowName.trim(),
          rules: rules
        }),
      });

      const data = await response.json();

      if (data.success) {
        onWorkflowCreated(data.workflow);
        alert('Workflow created successfully!');
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Failed to create workflow');
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestWorkflow = async () => {
    if (rules.length === 0) {
      alert('Please create at least one rule first');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const data = JSON.parse(testData);
      
      const workflow = {
        id: 'test_workflow',
        name: workflowName || 'Test Workflow',
        rules: rules.map((rule, index) => ({
          ...rule,
          id: `rule_${index + 1}`,
          successAction: rule.successAction || { type: 'notify', message: 'Rule passed' },
          failureAction: rule.failureAction || { type: 'notify', message: 'Rule failed' }
        })),
        strategy: 'all'
      };

      const response = await fetch('/api/rules/workflow/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow,
          data
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTestResult(result.execution);
      }
    } catch (error) {
      console.error('Error testing workflow:', error);
      alert('Failed to test workflow. Check your test data JSON format.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="workflow-manager">
      <div className="workflow-header">
        <h2>Workflow Manager</h2>
      </div>

      <div className="workflow-actions">
        <div className="form-group">
          <label>Workflow Name:</label>
          <input
            type="text"
            className="workflow-name-input"
            placeholder="e.g., Insurance Eligibility Check"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
        </div>

        <button 
          className="create-workflow-btn"
          onClick={handleCreateWorkflow}
          disabled={isCreating || rules.length === 0}
        >
          {isCreating ? 'Creating...' : 'Create Workflow'}
        </button>
      </div>

      <div className="test-section">
        <h3>Test Workflow</h3>
        <div className="form-group">
          <label>Test Data (JSON):</label>
          <textarea
            className="test-data-input"
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            rows="6"
            placeholder='{\n  "age": 45,\n  "is_smoker": true\n}'
          />
        </div>

        <button 
          className="test-workflow-btn"
          onClick={handleTestWorkflow}
          disabled={isTesting || rules.length === 0}
        >
          {isTesting ? 'Testing...' : 'Test Workflow'}
        </button>

        {testResult && (
          <div className="test-results">
            <h4>Test Results</h4>
            <div className={`result-summary ${testResult.finalResult}`}>
              Final Result: <strong>{testResult.finalResult.toUpperCase()}</strong>
            </div>
            
            <div className="rule-results">
              {testResult.results.map((result, index) => (
                <div key={index} className={`rule-result ${result.evaluation ? 'passed' : 'failed'}`}>
                  <div className="rule-result-header">
                    <span className="rule-name">{result.ruleName}</span>
                    <span className={`status ${result.evaluation ? 'passed' : 'failed'}`}>
                      {result.evaluation ? '✓ PASSED' : '✗ FAILED'}
                    </span>
                  </div>
                  {result.evaluation && result.successAction && (
                    <div className="action-executed">
                      Success Action: {result.successAction.description || JSON.stringify(result.successAction)}
                    </div>
                  )}
                  {!result.evaluation && result.failureAction && (
                    <div className="action-executed">
                      Failure Action: {result.failureAction.description || JSON.stringify(result.failureAction)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowManager;
