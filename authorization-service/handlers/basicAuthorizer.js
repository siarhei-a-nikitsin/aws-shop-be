const generatePolicy = (principalId, resource, effect = "Allow") => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

const handler = async (event, _, cb) => {
  console.log("Event: ", JSON.stringify(event));

  const { type, authorizationToken, methodArn } = event;

  if (type !== "TOKEN") {
    cb("Unauthorized");
  }

  try {
    const authorizationTokenParts = authorizationToken.split(" ");

    let isAllowed = true;
    let userName = "unknown";

    if (
      !authorizationToken ||
      authorizationTokenParts.length !== 2 ||
      authorizationTokenParts[0] !== "Basic" ||
      !authorizationTokenParts[1]
    ) {
      isAllowed = false;
    } else {
      try {
        const encodedCredentials = authorizationToken.split(" ")[1];

        const buffer = Buffer.from(encodedCredentials, "base64");
        const [login, password] = buffer.toString("utf-8").split(":");

        console.log(
          `username: ${login} and password: ${password}, buffer = ${buffer.toString(
            "utf-8"
          )}`
        );

        userName = login;

        if(process.env[userName]) {
          const expectedUserPassword = process.env[userName];

          isAllowed = expectedUserPassword === password;
        } else {
          isAllowed = false;
        }
      } catch (e) {
        isAllowed = false;
      }
    }

    const policy = generatePolicy(
      userName,
      methodArn,
      isAllowed ? "Allow" : "Deny"
    );

    cb(null, policy);
  } catch (error) {
    cb(`Unauthorized: ${error.message}`);
  }
};

export default handler;
