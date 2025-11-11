import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import RulePreview from './components/RulePreview';
import WorkflowManager from './components/WorkflowManager';
import './App.css';

function App() {
  const [rules, setRules] = useState([]);
  const [workflow, setWorkflow] = useState(null);
  const [sessionId] = useState(`session_${Date.now()}`);

  const handleRuleCreated = (newRule) => {
    setRules(prevRules => [...prevRules, newRule]);
  };

  const handleWorkflowCreated = (newWorkflow) => {
    setWorkflow(newWorkflow);
  };

  const handleClearRules = () => {
    if (window.confirm('Are you sure you want to clear all rules?')) {
      setRules([]);
      setWorkflow(null);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🤖 AI-Based Rule Configurator</h1>
        <p>Admin Platform for Insurance Rule Configuration</p>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <ChatInterface 
            onRuleCreated={handleRuleCreated}
            sessionId={sessionId}
          />
        </div>

        <div className="right-panel">
          <div className="panel-header">
            <h2>Preview & Management</h2>
            {rules.length > 0 && (
              <button className="clear-btn" onClick={handleClearRules}>
                Clear All Rules
              </button>
            )}
          </div>

          <RulePreview rules={rules} workflow={workflow} />
          
          {rules.length > 0 && (
            <WorkflowManager 
              rules={rules} 
              onWorkflowCreated={handleWorkflowCreated}
            />
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p>AI Rule Engine - Configure complex insurance rules with natural language</p>
      </footer>
    </div>
  );
}

export default App;
