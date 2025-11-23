const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// 中间件
app.use(cors()); // 允许所有跨域请求
app.use(express.json()); // 解析JSON请求体

// 代理路由
app.post('/api/v3/chat/completions', async (req, res) => {
    try {
        const response = await axios.post(
            'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
            req.body, // 直接转发前端发送的请求体
            {
                headers: {
                    'Authorization': req.headers.authorization, // 从原始请求中获取认证信息
                    'Content-Type': 'application/json'
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('代理请求出错:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            error: '代理请求失败',
            details: error.response ? error.response.data : error.message
        });
    }
});

app.listen(port, () => {
    console.log(`代理服务器正在 http://localhost:${port} 上运行`);
});
