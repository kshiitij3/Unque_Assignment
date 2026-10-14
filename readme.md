LeadFlow – Meta Lead Ads + React Native PoC
I built LeadFlow to test one simple idea: when someone submits a Meta lead form, their lead should show up in an already-open mobile app without anyone needing to refresh the screen.
The project has a React Native app, a Node.js backend, and a MongoDB database. Socket.IO is used to push new leads to the phone as soon as the backend has saved them.
What it does
- Displays saved leads in a React Native dashboard.
- Loads existing leads from the backend when the app opens.
- Listens for the lead:new Socket.IO event and adds new leads to the screen.
- Receives Meta webhook verification requests and validates signed webhook notifications.
- Fetches lead details from Meta's Graph API and stores them in MongoDB.
- Includes an optional development-only polling mode for checking Meta test leads while webhook delivery is being set up.
This is a proof of concept, so the focus is on demonstrating the flow end to end rather than building a full production lead-management product.
Tech used
Mobile: React Native, Expo, JavaScript, React Navigation, Socket.IO Client
Backend: Node.js, Express, Axios, Socket.IO
Database: MongoDB with Mongoose
Meta integration: Meta Webhooks and Graph API
Local webhook testing: ngrok


Testing the flow
1. Start MongoDB access, the backend, and the Expo app.
2. Confirm that the mobile dashboard connects to Socket.IO.
3. Start ngrok if testing Meta webhooks.
4. Open Meta's Lead Ads Testing Tool.
5. Select the correct Facebook Page and Instant Form, then create a test lead.
6. Check the backend terminal and ngrok inspector for webhook activity.
7. Confirm the lead appears on the already-open mobile dashboard without refreshing.
If webhook delivery is unavailable in the current Meta app mode, the development poller can be enabled by setting META_TEST_LEAD_POLLING_ENABLED=true. It requires a working Page access token and the correct Page and form IDs. Turn it off when it is no longer needed.