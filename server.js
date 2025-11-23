const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

// Thay bằng token Hugging Face của bạn
const HF_TOKEN = "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"; 

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: userMessage })
        });
        const data = await response.json();
        let botReply = "Xin lỗi, tôi không trả lời được.";
        if (data?.generated_text) botReply = data.generated_text;
        else if (Array.isArray(data) && data[0]?.generated_text) botReply = data[0].generated_text;
        res.json({ reply: botReply });
    } catch (err) {
        console.error(err);
        res.json({ reply: "Lỗi kết nối API." });
    }
});

app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));

