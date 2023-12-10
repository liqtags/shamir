
# Shamir

Shamir Secret Sharing implementation in Typescript

# What is Shamir's secret sharing?

Shamir's secret sharing is an efficient secret sharing algorithm for distributing private information among a group so that the secret cannot be revealed unless a quorum of the group acts together to pool their knowledge

## Examples

```javascript
const main = async () => {
    /**
     * splitWithPasswordToFile
     * This splits the input into shares with a password and writes them to a file
     */
    await splitWithPasswordToFile('gtp2at', 'hello world', 'password', 5, 3);
    /**
     * combineShares
     * This combines the shares from the file and returns the secret
     */
    const combinedShares = await combineShares('gtp2at_shares.json', 'password');
    return combinedShares;
}

main();
```

example of 1 share in the example you need 3 shares out of the 5 to reveal the key

```json
  {
    "version": 1,
    "id": "d10b5ef8-ff59-4e16-9bdb-4b3f8a3a574c",
    "share": {
      "total": 5,
      "threshold": 3,
      "encrypted": true,
      "share_sha512": "08f69b0295c536c4c7c5e6611624b5a4ddbef62a37a7fc41a191a8d6667468e0f408826c9ffe0b9b543fa592a36ca74668895323941e5025450df647c74808a5",
      "secret_sha512": "309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f"
    },
    "crypto": {
      "ciphertext": "726d2bfc994c7f07426fc39169a51ff52e5cf9f214418c6f358a8d33",
      "cipherparams": {
        "iv": "243,24,238,186,142,120,99,43,92,239,121,177",
        "name": "AES-GCM",
        "length": 256
      },
      "kdf": "PBKDF2",
      "kdfparams": {
        "salt": "240,58,26,135,244,86,212,16,3,125,84,232,14,51,207,41",
        "iterations": 100000,
        "hash": "SHA-256"
      }
    },
    "algorithm": "shamir-secret-sharing"
  },
```
