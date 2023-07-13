## Roboto Frontend Service 

NOTE: If you're running VSCode and have the JavaScript Debugger Companion Extension installed, you can very quickly run the app with a debugger attached by clicking the "Run and Debug" icon on the left hand side. The ```.vscode/launch.json``` file has been pre-configured for you.  

## Getting up and running 

1. npm install 
2. Add a '.env' file to the frontend-service directory. The .env file needs the following variables: 
```
NEXT_PUBLIC_REACT_APP_ENV="dev"
NEXT_PUBLIC_REACT_APP_MIXPANEL_TOKEN="3f88b9c6bcee841dde5fa23120ba6d7e"
NEXT_PUBLIC_AWS_COGNITO_REGION="us-west-2"
NEXT_PUBLIC_AWS_USER_POOLS_ID=<sandbox-user-pool-id-here>
NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID=<web-client-id-here>
NEXT_PUBLIC_API_URL="https://jh.api-dev.roboto.ai" //replace with your sandbox url 
CYPRESS_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_IN="http://localhost:3000/signin?oauth=true"
NEXT_PUBLIC_OAUTH_REDIRECT_SIGN_OUT="http://localhost:3000/signin"
NEXT_PUBLIC_OAUTH_COGNITO_DOMAIN="roboto-managed-jh.auth.us-west-2.amazoncognito.com" //replace with your cognito domain
```
3. npm run dev (or use VSCode and use the provided debug configuration. Just press play!)

At this point your local frontend-service should be up and running on http://localhost:3000. Deploying the API to your sandbox environment is out of scope for this document, please check the API service docs for instructions on how to do that. 


## Code Organization 

``` 
cypress: //contains code for all e2e tests   
__tests__ //contains test related mocks, helpers, utilities, and configurations      
src:        
  components //contains all shared components that are used across the entire application    
  config  //contains the application configuration files   
  features: //contains all feature based modules   
    api    
    components   
    pages     
    types     
    index.tsx     
  layouts //contains different layouts for the pages    
  lib //contains configurations for different libraries used in the application     
  pages //contains the pages of the application, where NextJS will look for file system based routing    
  providers //contains all application providers, e.g. MUI, State Management, Drag N Drop, etc.     
  stores //contains all global state stores used in the application      
  types //contains basic TypeScript definitions that are used across the application     
  utils //contains all shared utility functions   
  service //contains functionality for common app services, e.g. mixpanel, logging, etc. 
```          



