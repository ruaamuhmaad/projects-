// Calculator object using ES6 features
const calculator = {
    // Properties
    currentInput: '0',
    operator: null,
    previousInput: null,
    waitingForNewInput: false,

    // DOM element
    display: document.getElementById('display'),

    // Methods using arrow functions
    updateDisplay: () => {
        calculator.display.textContent = calculator.currentInput;
    },

    inputNumber: (num) => {
        if (calculator.waitingForNewInput) {
            calculator.currentInput = num;
            calculator.waitingForNewInput = false;
        } else {
            calculator.currentInput = calculator.currentInput === '0' ? num : calculator.currentInput + num;
        }
        calculator.updateDisplay();
    },

    inputDecimal: () => {
        if (calculator.waitingForNewInput) {
            calculator.currentInput = '0.';
            calculator.waitingForNewInput = false;
        } else if (calculator.currentInput.indexOf('.') === -1) {
            calculator.currentInput += '.';
        }
        calculator.updateDisplay();
    },

    inputOperator: (nextOperator) => {
        const inputValue = parseFloat(calculator.currentInput);

        if (calculator.previousInput === null) {
            calculator.previousInput = inputValue;
        } else if (calculator.operator) {
            const result = calculator.performCalculation();
            
            if (result === 'Error') {
                calculator.showError();
                return;
            }
            
            calculator.currentInput = String(result);
            calculator.previousInput = result;
            calculator.updateDisplay();
        }

        calculator.waitingForNewInput = true;
        calculator.operator = nextOperator;
    },

    calculate: () => {
        const inputValue = parseFloat(calculator.currentInput);

        if (calculator.previousInput !== null && calculator.operator) {
            const result = calculator.performCalculation();
            
            if (result === 'Error') {
                calculator.showError();
                return;
            }
            
            calculator.currentInput = String(result);
            calculator.previousInput = null;
            calculator.operator = null;
            calculator.waitingForNewInput = true;
            calculator.updateDisplay();
        }
    },

    // Mathematical operations
    performCalculation: () => {
        const prev = parseFloat(calculator.previousInput);
        const current = parseFloat(calculator.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return 'Error';

        let result;
        
        switch (calculator.operator) {
            case '+':
                result = calculator.add(prev, current);
                break;
            case '-':
                result = calculator.subtract(prev, current);
                break;
            case '*':
                result = calculator.multiply(prev, current);
                break;
            case '/':
                result = calculator.divide(prev, current);
                break;
            default:
                return 'Error';
        }

        return Math.round(result * 100000000) / 100000000;
    },

    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => {
        if (b === 0) return 'Error';
        return a / b;
    },

    clear: () => {
        calculator.currentInput = '0';
        calculator.operator = null;
        calculator.previousInput = null;
        calculator.waitingForNewInput = false;
        calculator.display.classList.remove('error');
        calculator.updateDisplay();
    },

    clearEntry: () => {
        calculator.currentInput = '0';
        calculator.display.classList.remove('error');
        calculator.updateDisplay();
    },

    showError: () => {
        calculator.display.textContent = 'Error';
        calculator.display.classList.add('error');
        calculator.display.parentElement.classList.add('shake');
        
        setTimeout(() => {
            calculator.display.parentElement.classList.remove('shake');
            calculator.clear();
        }, 1500);
    }
};

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        calculator.inputNumber(key);
    } else if (key === '.') {
        calculator.inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        calculator.inputOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculator.calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        calculator.clear();
    } else if (key === 'Backspace') {
        event.preventDefault();
        calculator.clearEntry();
    }
});

// Initialize display
calculator.updateDisplay();
