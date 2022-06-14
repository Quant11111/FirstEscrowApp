# Basic Sample Hardhat Project

note from dev

This project was my first attempt to create an onchain escrow app. The contract isn't gaz efficient at all if the number of escrow generated start to increase a lot.
I started a new project using a factory contract in order to deploy other contract and avoïding storing very large arrays onchain.

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

Escrow deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
