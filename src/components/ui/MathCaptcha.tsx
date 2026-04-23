'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface MathCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export default function MathCaptcha({ onVerify, className = '' }: MathCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);

  const generateQuestion = () => {
    const operators = ['+', '-', '×'];
    const selectedOperator = operators[Math.floor(Math.random() * operators.length)];
    
    let n1, n2;
    if (selectedOperator === '+') {
      n1 = Math.floor(Math.random() * 20) + 1;
      n2 = Math.floor(Math.random() * 20) + 1;
    } else if (selectedOperator === '-') {
      n1 = Math.floor(Math.random() * 20) + 10;
      n2 = Math.floor(Math.random() * n1) + 1;
    } else { // ×
      n1 = Math.floor(Math.random() * 10) + 1;
      n2 = Math.floor(Math.random() * 10) + 1;
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperator(selectedOperator);
    setUserAnswer('');
    setIsValid(false);
    onVerify(false);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (userAnswer) {
      const correctAnswer = calculateAnswer();
      const valid = parseInt(userAnswer) === correctAnswer;
      setIsValid(valid);
      onVerify(valid);
    } else {
      setIsValid(false);
      onVerify(false);
    }
  }, [userAnswer]);

  const calculateAnswer = () => {
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '×': return num1 * num2;
      default: return 0;
    }
  };

  return (
    <div className={`math-captcha ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Security Check *
      </label>
      <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2 text-lg font-mono text-gray-900 dark:text-white">
          <span>{num1}</span>
          <span>{operator}</span>
          <span>{num2}</span>
          <span>=</span>
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className={`w-20 px-2 py-1 border rounded text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
            userAnswer && isValid
              ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
              : userAnswer && !isValid
                ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="?"
          required
        />
        <button
          type="button"
          onClick={generateQuestion}
          className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          title="Generate new question"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      {userAnswer && !isValid && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">Incorrect answer. Please try again.</p>
      )}
      {isValid && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Verified</p>
      )}
    </div>
  );
}