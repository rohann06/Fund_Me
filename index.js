// Imports
import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constents.js";

//Buttens
//connect
const connect_btn = document.getElementById("connect");
connect_btn.onclick = Connect;
//fund
const fund_btn = document.getElementById("fund");
fund_btn.onclick = fund;
//balance
const balance_btn = document.getElementById("balance");
balance_btn.onclick = balance;
//withdraw
const withdraw_btn = document.getElementById("withdraw");
withdraw_btn.onclick = withdraw;

// Connect the wallet
async function Connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connect_btn.innerHTML = "Connected!";
  } else {
    alert("please install matamask");
    connect_btn.innerHTML = "install matamask!";
  }
}

//Fund
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum); //Provider : node(connectin to the blockchain)
    const signer = provider.getSigner(); //Signer : wallet
    const contract = new ethers.Contract(contractAddress, abi, signer); //contract : ABI / Address

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await console.log(`You funded ${ethAmount} ETHs, Thank you!`);
      // listen for the the transaction tobe mine
      await listenFortransactionMine(transactionResponse, provider);
      console.log(`Done.`);
    } catch (error) {
      console.log(error);
    }
    connect_btn.innerHTML = "Connected!";
  } else {
    alert("please install matamask");
    connect_btn.innerHTML = "install matamask!";
  }
}
// transaction mining
function listenFortransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `completed ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

// Contract balance
async function balance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum); //Provider : node(connectin to the blockchain)
    const balance = await provider.getBalance(contractAddress);
    alert(
      `The balance of the conract is: ${ethers.utils.formatEther(
        balance
      )} ETHs.`
    );
  } else {
    alert("please install matamask");
    connect_btn.innerHTML = "install matamask!";
  }
}

//Withdraw
async function withdraw() {
  console.log("withdrawing..");
  const ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum); //Provider : node(connectin to the blockchain)
    const signer = provider.getSigner(); //Signer : wallet
    const contract = new ethers.Contract(contractAddress, abi, signer); //contract : ABI / Address

    try {
      const transactionResponse = await contract.withdraw();
      await listenFortransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
    connect_btn.innerHTML = "Connected!";
  } else {
    alert("please install matamask");
    connect_btn.innerHTML = "install matamask!";
  }
}
