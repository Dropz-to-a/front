// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// 토스 테스트 시크릿 키
const SECRET_KEY = "test_sk_LlDJaYngroaw5BGOXNMX3ezGdRpX"; // 여기에 실제 테스트 시크릿 키 넣기

app.post("/api/pay", async (req, res) => {
    const { amount, orderId, orderName, customerKey } = req.body;

    if (!amount || !orderId || !orderName || !customerKey) {
        return res.status(400).json({ error: "필수 파라미터가 누락되었습니다." });
    }

    try {
        // 1️⃣ 테스트 카드 정보 (Toss 개발자 문서 참고)
        const cardInfo = {
            cardNumber: "1234-5678-1234-5678",
            expiry: "12/26",
            birth: "900101",
            password: "12",
        };

        // 2️⃣ 빌링키 발급 요청
        const billingKeyResponse = await axios.post(
            "https://api.tosspayments.com/v1/billing/authorizations",
            {
                customerKey, // 고객 식별용 고유값
                ...cardInfo,
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString("base64")}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const billingKey = billingKeyResponse.data.billingKey;

        // 3️⃣ 실제 결제 요청 (빌링 결제)
        const paymentResponse = await axios.post(
            "https://api.tosspayments.com/v1/billing/payments",
            {
                billingKey,
                orderId,
                orderName,
                amount,
            },
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${SECRET_KEY}:`).toString("base64")}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({
            message: "결제 요청 완료",
            payment: paymentResponse.data,
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "결제 요청 중 오류가 발생했습니다.", detail: err.response?.data });
    }
});

app.listen(PORT, () => {
    console.log(`Billing Server running on http://localhost:${PORT}`);
});
