const dev = { 
    s3: {
        REGION: "us-east-1",
        BUCKET: "fragmentsbucket2", 
    },
    apiGateway: {
        REGION: "us-east-1", 
        URL: "https://4zrimym1l2.execute-api.us-east-1.amazonaws.com/prod",
    }, 
    cognito: {
        REGION: "us-east-1", 
        USER_POOL_ID: "us-east-1_YmSrUMFWu", 
        APP_CLIENT_ID: "20lfdrlqvk3ou9tkcai6uidj6", 
        IDENTITY_POOL_ID: "us-east-1:e9d01a53-04eb-4e16-9498-7bec2a073add",
    }
};
const prod = { 
    s3: {
        REGION: "us-east-1",
        BUCKET: "fragments-bucket-485", 
    },
    apiGateway: {
        REGION: "us-east-1", 
        URL: "https://627z9zr3e5.execute-api.us-east-1.amazonaws.com/prod",
    }, 
    cognito: {
        REGION: "us-east-1", 
        USER_POOL_ID: "us-east-1_5Hu24dwhy", 
        APP_CLIENT_ID: "47bmnj1nlrr082tmknb09r0liu", 
        IDENTITY_POOL_ID: "us-east-1:3b37b10a-64f0-4e0c-a4f2-fe8cce1852d4",
    }
};
const config = {
    social: {
        FB: "753851305538399"
    },
    MAX_ATTACHMENT_SIZE: 5000000,

    //Default to dev if not set 
    ...(process.env.REACT_APP_STAGE === "prod" ? prod : dev),
}; 

export default config;