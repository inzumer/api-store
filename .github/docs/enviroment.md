## 🔐 Environment Variables

This project relies on several environment variables for configuration. Create a .env file in the root of the project and define the following keys:

```bash
# MongoDB configuration
MONGO_USER=${youruser_replace_this}
MONGO_PASSWORD=${yourpass_replace_this} 
MONGO_HOST=mateandmethods.2q3ycr1.mongodb.net
MONGO_DB=api-store
MONGO_OPTIONS=retryWrites=true&w=majority

# Sentry configuration
SENTRY_DSN=https://69fa7a508c6d70541cdf91f46b30a303@o4509554043912192.ingest.us.sentry.io/4509554045091840

# Configuration
CORS_ORIGIN=http://localhost:3000
PORT=3000
AMBIENT_MODE=development
PACKAGE_VERSION=1.0.0


# JWT configuration
JWT_SECRET=loquesecreto123

# APPS IDs
WEB_MOBILE_APP_ID='e7f91a2b-0f0e-4d1a-a6de-7fc8c5e9a001'
WEB_DESKTOP_APP_ID='d31227b9-6bb4-4e13-bd89-b17b1cda2c02'
ANDROID_APP_ID='97a2a2e4-3493-4fc2-9202-2046405d0603'
IOS_APP_ID='f00bd144-5395-4f2e-82ef-251d30405ed2'
TABLET_APP_ID='6cd85e72-1197-4ab3-acc7-e670fd7c91ac'
DESKTOP_APP_ID='9b03e24b-1df1-4418-b52b-d71c3ef1e10e'
SWAGGER_APP_ID='123e4567-e89b-12d3-a456-426614174000'
```