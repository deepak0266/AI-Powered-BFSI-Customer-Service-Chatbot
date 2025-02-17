// OpenAI API Integration
async function getOpenAIResponse(message) {
    try {
        const response = await fetch('https://ai-powered-bfsi-customer-service-chatbot.vercel.app/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        return data.reply;
    } catch (error) {
        return "Sorry, I can't connect to the server. 😢";
    }
}
// --------------------------
// Chatbot Functions
// --------------------------
function toggleChat() {
    const chatInterface = document.querySelector('.chatbot-interface');
    chatInterface.style.display = chatInterface.style.display === 'none' ? 'flex' : 'none';
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();

    if (message) {
        addMessage(message, 'user'); // User का message दिखाएं
        input.value = '';

        // Loading indicator दिखाएं
        const loading = document.createElement('div');
        loading.className = 'message bot';
        loading.textContent = 'Typing...';
        document.getElementById('chatMessages').appendChild(loading);

        try {
            const botResponse = await getOpenAIResponse(message); // OpenAI से response लें
            loading.remove(); // Loading हटाएं
            addMessage(botResponse, 'bot'); // Bot का response दिखाएं
        } catch (error) {
            loading.remove();
            addMessage("Sorry, I'm facing technical issues. 😢", 'bot');
        }
    }
}

// Enter key handle करें
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Messages को chat में add करें
function addMessage(message, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`; // CSS styling के लिए class
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);

    // Automatically scroll to latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --------------------------
// Initialize Chatbot
// --------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Chatbot को शुरू में छुपाएं
    document.querySelector('.chatbot-interface').style.display = 'none';
});


// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.feature-card, .tool-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    observer.observe(card);
});



// Open Fragment Box and Load Calculator
// Open Fragment Box and Load Calculator
function openInterestCalculator() {
    const fragmentBox = document.getElementById('fragmentBox');
    const fragmentContent = document.getElementById('fragmentContent');
    fragmentContent.innerHTML = `
        <h4>Interest Calculator</h4>
        <form class="calculator-form" onsubmit="calculateInterest(event)">
            <label for="principal">Principal Amount (₹):</label>
            <input type="number" id="principal" required>
            <label for="rate">Interest Rate (%):</label>
            <input type="number" id="rate" required>
            <label for="time">Time (years):</label>
            <input type="number" id="time" required>
            <label for="type">Interest Type:</label>
            <select id="type" required>
                <option value="simple">Simple Interest</option>
                <option value="compound">Compound Interest</option>
            </select>
            <button type="submit">Calculate</button>
        </form>
        <div class="result" id="interestResult"></div>
    `;
    fragmentBox.style.display = 'block';
}

function openEMICalculator() {
    const fragmentBox = document.getElementById('fragmentBox');
    const fragmentContent = document.getElementById('fragmentContent');
    fragmentContent.innerHTML = `
        <h4>Loan EMI Calculator</h4>
        <form class="calculator-form" onsubmit="calculateEMI(event)">
            <label for="loanAmount">Loan Amount (₹):</label>
            <input type="number" id="loanAmount" required>
            <label for="interestRate">Interest Rate (%):</label>
            <input type="number" id="interestRate" required>
            <label for="loanTenure">Loan Tenure (years):</label>
            <input type="number" id="loanTenure" required>
            <button type="submit">Calculate</button>
        </form>
        <div class="result" id="emiResult"></div>
    `;
    fragmentBox.style.display = 'block';
}

function openTaxCalculator() {
    const fragmentBox = document.getElementById('fragmentBox');
    const fragmentContent = document.getElementById('fragmentContent');
    fragmentContent.innerHTML = `
        <h4>Tax Calculator</h4>
        <form class="calculator-form" onsubmit="calculateTax(event)">
            <label for="income">Annual Income (₹):</label>
            <input type="number" id="income" required>
            <label for="deductions">Deductions (₹):</label>
            <input type="number" id="deductions" required>
            <button type="submit">Calculate</button>
        </form>
        <div class="result" id="taxResult"></div>
    `;
    fragmentBox.style.display = 'block';
}

// Close Fragment Box
function closeFragmentBox() {
    const fragmentBox = document.getElementById('fragmentBox');
    fragmentBox.style.display = 'none';
}

// Calculator Functions
function calculateInterest(event) {
    event.preventDefault();
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const time = parseFloat(document.getElementById('time').value);
    const type = document.getElementById('type').value;

    let interest;
    if (type === 'simple') {
        interest = (principal * rate * time) / 100;
    } else {
        interest = principal * (Math.pow(1 + rate / 100, time)) - principal;
    }

    document.getElementById('interestResult').innerText = `Interest: ₹${interest.toFixed(2)}`;
}

function calculateEMI(event) {
    event.preventDefault();
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);

    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTenure * 12;
    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    document.getElementById('emiResult').innerText = `Monthly EMI: ₹${emi.toFixed(2)}`;
}

function calculateTax(event) {
    event.preventDefault();
    const income = parseFloat(document.getElementById('income').value);
    const deductions = parseFloat(document.getElementById('deductions').value);

    const taxableIncome = income - deductions;
    let tax = 0;

    if (taxableIncome > 1000000) {
        tax = 112500 + (taxableIncome - 1000000) * 0.3;
    } else if (taxableIncome > 500000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else if (taxableIncome > 250000) {
        tax = (taxableIncome - 250000) * 0.05;
    }

    document.getElementById('taxResult').innerText = `Tax Payable: ₹${tax.toFixed(2)}`;
}
event.preventDefault();
const income = parseFloat(document.getElementById('income').value);
const deductions = parseFloat(document.getElementById('deductions').value);

const taxableIncome = income - deductions;
let tax = 0;

if (taxableIncome > 1000000) {
    tax = 112500 + (taxableIncome - 1000000) * 0.3;
} else if (taxableIncome > 500000) {
    tax = 12500 + (taxableIncome - 500000) * 0.2;
} else if (taxableIncome > 250000) {
    tax = (taxableIncome - 250000) * 0.05;
}

document.getElementById('taxResult').innerText = `Tax Payable: ₹${tax.toFixed(2)}`;

