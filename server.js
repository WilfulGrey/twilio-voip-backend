const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !apiKey || !apiSecret || !twilioPhoneNumber) {
    console.error('Missing required Twilio configuration in environment variables');
    process.exit(1);
}

app.post('/token', (req, res) => {
    try {
        const { identity, allowIncomingCalls = true } = req.body;

        if (!identity) {
            return res.status(400).json({
                error: 'Identity parameter is required'
            });
        }

        const accessToken = new AccessToken(
            accountSid,
            apiKey,
            apiSecret,
            { identity: identity }
        );

        const voiceGrant = new VoiceGrant({
            outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
            incomingAllow: allowIncomingCalls,
        });

        accessToken.addGrant(voiceGrant);

        res.json({
            identity: identity,
            token: accessToken.toJwt()
        });

    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({
            error: 'Failed to generate access token'
        });
    }
});

app.post('/make-call', (req, res) => {
    try {
        const { to, from, identity } = req.body;

        if (!to) {
            return res.status(400).json({
                error: 'To parameter is required'
            });
        }

        const client = twilio(accountSid, process.env.TWILIO_AUTH_TOKEN);

        const twiml = `
            <Response>
                <Dial callerId="${from || twilioPhoneNumber}">
                    <Number>${to}</Number>
                </Dial>
            </Response>
        `;

        res.type('text/xml');
        res.send(twiml);

    } catch (error) {
        console.error('Error making call:', error);
        res.status(500).json({
            error: 'Failed to process call'
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`Twilio VoIP Backend server running on port ${port}`);
    console.log(`Health check available at: http://localhost:${port}/health`);
    console.log(`Token endpoint available at: http://localhost:${port}/token`);
});