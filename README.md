# LIT JWT Verifier

This package provides a simple way to verify JWT tokens signed by the Lit Protocol. Typically, a JWT comes from a user who is trying to access a resource.

## Installation

```bash
yarn add lit-jwt-verifier
```

## Usage

Use the `verifyJwt` method as below to verify a JWT. Make sure to check that the payload matches the resourceId of the condition you're checking.

```js
import { verifyJwt } from "lit-jwt-verifier";

const { payload, header, signature, verified } = await verifyJwt({ jwt });

// LIT Developers: change this to the baseUrl you are authenticating, path, and other params in the payload
// so that they match the resourceId that you used when you saved the signing condition to the Lit Protocol
if (
  !verified ||
  payload.baseUrl !== "my-dynamic-content-server.com" ||
  // LIT Developers: uncomment the line below and change this to the path you are authenticating
  // payload.path !== '/path-you-expected' ||
  payload.orgId !== "" ||
  payload.role !== "" ||
  payload.extraData !== ""
) {
  // Reject this request!
  return false;
}
```

The "verified" variable is a boolean that indicates whether or not the signature verified properly. Note: YOU MUST CHECK THE PAYLOAD AGAINST THE CONTENT YOU ARE PROTECTING. This means you need to look at "payload.baseUrl" which should match the hostname of the server, and you must also look at "payload.path" which should match the path being accessed. If these do not match what you're expecting, you should reject the request.

## Support

Join our discord at https://litgateway.com/discord and check out our docs at https://developer.litprotocol.com/
