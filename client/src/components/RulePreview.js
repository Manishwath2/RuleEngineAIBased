import React from 'react';
import '../styles/RulePreview.css';

const RulePreview = ({ rules, workflow }) => {
  const renderRule = (rule, index) => {
    if (rule.type === 'simple') {
      return (
        <div key={index} className="rule-item simple-rule">
          <div className="rule-header">
            <span className="rule-type-badge">Simple Rule</span>
            <span className="rule-name">{rule.name || `Rule ${index + 1}`}</span>
          </div>
          <div className="rule-details">
            <div className="rule-condition">
              <span className="field">{rule.field}</span>
              <span className="operator">{rule.operator}</span>
              <span className="value">{String(rule.value)}</span>
            </div>
          </div>
          {rule.successAction && (
            <div className="action success-action">
              <strong>On Success:</strong> {rule.successAction.description || JSON.stringify(rule.successAction)}
            </div>
          )}
          {rule.failureAction && (
            <div className="action failure-action">
              <strong>On Failure:</strong> {rule.failureAction.description || JSON.stringify(rule.failureAction)}
            </div>
          )}
        </div>
      );
    } else if (rule.type === 'composite') {
      return (
        <div key={index} className="rule-item composite-rule">
          <div className="rule-header">
            <span className="rule-type-badge composite">Composite Rule</span>
            <span className="rule-name">{rule.name || `Composite Rule ${index + 1}`}</span>
          </div>
          <div className="rule-details">
            <div className="composite-operator">{rule.operator}</div>
            <div className="sub-rules">
              {rule.rules && rule.rules.map((subRule, subIndex) => (
                <div key={subIndex} className="sub-rule">
                  <span className="field">{subRule.field}</span>
                  <span className="operator">{subRule.operator}</span>
                  <span className="value">{String(subRule.value)}</span>
                </div>
              ))}
            </div>
          </div>
          {rule.successAction && (
            <div className="action success-action">
              <strong>On Success:</strong> {rule.successAction.description || JSON.stringify(rule.successAction)}
            </div>
          )}
          {rule.failureAction && (
            <div className="action failure-action">
              <strong>On Failure:</strong> {rule.failureAction.description || JSON.stringify(rule.failureAction)}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rule-preview">
      <div className="preview-header">
        <h2>Rule Preview</h2>
        {workflow && (
          <div className="workflow-info">
            <strong>Workflow:</strong> {workflow.name}
          </div>
        )}
      </div>
      
      <div className="rules-list">
        {rules.length === 0 ? (
          <div className="empty-state">
            <p>No rules created yet. Start chatting with the AI to create rules!</p>
          </div>
        ) : (
          rules.map((rule, index) => renderRule(rule, index))
        )}
      </div>

      {rules.length > 0 && (
        <div className="json-preview">
          <h3>JSON Configuration</h3>
          <pre className="json-output">
            {JSON.stringify(workflow || { rules }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RulePreview;
