const axios = require('axios');

module.exports = async (req, res) => {

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // User का Message लें
        const userMessage = req.body.message;

        // OpenAI को Request भेजें
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content:"You are a BFSI (Banking, Financial Services, Insurance) expert AI. Only answer questions related to banking, loans, insurance, investments, and financial regulations. For other topics, respond: 'I specialize in BFSI topics only.' Keep answers professional and under 250 words.Use points to answer"
            }, {
                role: "user",
                content: userMessage
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // 🔑 यहाँ GitHub Secret आएगा
                'Content-Type': 'application/json'
            }
        });

        // Response भेजें Frontend को
        res.status(200).json({ reply: response.data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ error: "Oops! Something went wrong." });
    }
};
