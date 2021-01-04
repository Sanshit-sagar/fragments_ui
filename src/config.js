const config = { 
    s3: {
        REGION: "us-east-1",
        BUCKET: "myawsbucket-notes", 
    },
    apiGateway: {
        REGION: "us-east-1", 
        URL: "https://333p2a53cb.execute-api.us-east-1.amazonaws.com/prod",
    }, 
    cognito: {
        REGION: "us-east-1", 
        USER_POOL_ID: "us-east-1_ldkqSSVMX", 
        APP_CLIENT_ID: "2rk80j5vnn3k5e7sg18hhcijs7", 
        IDENTITY_POOL_ID: "us-east-1:a8c59e4c-b856-48cd-9014-428861f92770",
    },
};
export default config;