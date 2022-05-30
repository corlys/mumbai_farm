require("dotenv").config();
console.log(process.env.ALCHEMY_URL)
const ethers = require("ethers");
const { default: axios } = require("axios");

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);

const walletA = new ethers.Wallet(process.env.A_PKEY, provider);
const walletB = new ethers.Wallet(process.env.B_PKEY, provider);
const walletC = new ethers.Wallet(process.env.C_PKEY, provider);
const walletD = new ethers.Wallet(process.env.D_PKEY, provider);

console.log(walletA.address)

const wallets = {
  a: walletA,
  b: walletB,
  c: walletC,
};

const sendEther = async (element) => {
  try {
    let wallet;

    switch (element) {
      case walletA.address:
        wallet = wallets.a;
        break;
      case walletB.address:
        wallet = wallets.b;
        break;
      case walletC.address:
        wallet = wallets.c;
        break;
      default:
        throw new Error("HAH ERROR");
      // code block
    }

    const tx = {
      to: walletD.address,
      value: ethers.utils.parseEther("10"),
      gasLimit: 6000000,
    };

    const sendTx = await wallet.sendTransaction(tx);

    await sendTx.wait();
    console.log(sendTx?.hash);
  } catch (error) {
    // console.log(error);
  }
};

setInterval(() => {
  const listAccount = [
    walletA.address,
    walletB.address,
    walletC.address,
  ];

  listAccount.forEach(async (element) => {
    const getMatic = await axios.post(
      "https://api.faucet.matic.network/transferTokens",
      {
        address: element,
        network: "mumbai",
        token: "maticToken",
      }
    );
    if (getMatic.data.error) {
      console.log(`ACCOUNT ${element} PENUH`);
      await sendEther(element);
    } else {
      console.log(getMatic.data);
    }
  });
}, 70000);