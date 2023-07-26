## Roboto Frontend Service 

NOTE: If you're running VSCode and have the JavaScript Debugger Companion Extension installed, you can very quickly run the app with a debugger attached by clicking the "Run and Debug" icon on the left hand side. The ```.vscode/launch.json``` file has been pre-configured for you.  

## Getting up and running 

1. npm install 
2. Add a '.env' file to the frontend-service directory.
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



