import { fromString } from "uint8arrays/from-string";
import { toString } from "uint8arrays/to-string";

import { verify } from "@noble/bls12-381";

export const NETWORK_PUB_KEY = fromString(
  "9971e835a1fe1a4d78e381eebbe0ddc84fde5119169db816900de796d10187f3c53d65c1202ac083d099a517f34a9b62",
  "base16"
);

/**
 * Verify a JWT from the LIT network.  Use this for auth on your server.  For some background, users can define resources (URLs) for authorization via on-chain conditions using the saveSigningCondition function.  Other users can then request a signed JWT proving that their ETH account meets those on-chain conditions using the getSignedToken function.  Then, servers can verify that JWT using this function.  A successful verification proves that the user meets the on-chain conditions defined in the saveSigningCondition step.  For example, the on-chain condition could be posession of a specific NFT.
 * @param {string} jwt A JWT signed by the LIT network using the BLS12-381 algorithm
 * @returns {Object} An object with 4 keys: "verified": A boolean that represents whether or not the token verifies successfully.  A true result indicates that the token was successfully verified.  "header": the JWT header.  "payload": the JWT payload which includes the resource being authorized, etc.  "signature": A uint8array that represents the raw  signature of the JWT.
 */
export async function verifyJwt(jwt) {
  // console.log("pubkey is ", pubKey);
  const jwtParts = jwt.split(".");
  const signature = fromString(jwtParts[2], "base64url");
  // console.log("sig is ", uint8arrayToString(sig, "base16"));
  const unsignedJwt = `${jwtParts[0]}.${jwtParts[1]}`;
  // console.log("unsignedJwt is ", unsignedJwt);
  const message = fromString(unsignedJwt);
  // console.log("message is ", message);
  const header = JSON.parse(toString(fromString(jwtParts[0], "base64url")));
  const payload = JSON.parse(toString(fromString(jwtParts[1], "base64url")));

  let verified = false;
  if (
    header.alg === "BLS12-381" &&
    header.typ === "JWT" &&
    payload.iss === "LIT"
  ) {
    verified = await verify(signature, unsignedJwt, NETWORK_PUB_KEY);
  } else {
    console.log(
      "Error verifying JWT.  Something is wrong with header.alg or header.typ or payload.iss.  header: ",
      header,
      "payload: ",
      payload
    );
  }

  if (Date.now() > payload.exp * 1000) {
    console.log(
      `JWT has expired.  Expired at ${
        payload.exp * 1000
      } and current time is ${Date.now()}`
    );
    verified = false;
  }

  return {
    verified,
    header,
    payload,
    signature,
  };
}
