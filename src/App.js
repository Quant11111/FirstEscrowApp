import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Wallet from "./artifacts/contracts/Wallet.sol/Wallet.json";
import Escrow from "./artifacts/contracts/Escrow.sol/Escrow.json";
import "./App.css";

let WalletAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
let EscrowAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [balance, setBalance] = useState(0);
  const [amountSend, setAmountSend] = useState();
  const [amountWithdraw, setAmountWithdraw] = useState();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  //escrow cariables
  const [anountLocked, setAmountLocked] = useState(0);
  const [amountEscrow, setAmountEscrow] = useState();
  const [buyer, setBuyer] = useState();
  const [prestataire, setPrestataire] = useState();

  useEffect(() => {
    getBalance();
  }, []);

  //////////////////////////////////////////////////function Escrow////////////////////////////////////////////////////

  async function confirmPayment() {
    if (!amountEscrow || !prestataire) {
      return;
    }
    setError("");
    setSuccess("");
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EscrowAddress, Escrow.abi, signer);
      try {
        const val = { value: ethers.utils.parseEther(amountEscrow) };
        const transaction = await contract.confirmPayment(prestataire, val);
        await transaction.wait();
        setAmountEscrow("");
        setPrestataire("");
        getBalancePayment();
        setSuccess("Votre paiement est verrouillé ! ");
      } catch (err) {
        setError("Une erreur est survenue.");
      }
    }
  }

  async function confirmDeliver() {
    setError("");
    setSuccess("");
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EscrowAddress, Escrow.abi, signer);
      try {
        const transaction = await contract.confirmDeliver();
        await transaction.wait();
        setAmountEscrow("");
        setPrestataire("");
        getBalancePayment();
        setSuccess("Votre paiement a été envoyé ! ");
      } catch (err) {
        setError("Une erreur est survenue.");
      }
    }
  }

  async function refound() {
    if (!buyer) {
      return;
    }
    setError("");
    setSuccess("");
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EscrowAddress, Escrow.abi, signer);
      try {
        const transaction = await contract.refound(buyer);
        await transaction.wait();
        setAmountEscrow("");
        setPrestataire("");
        getBalancePayment();
        setSuccess("Remboursement effectué ! ");
      } catch (err) {
        setError("Une erreur est survenue.");
      }
    }
  }

  async function sinapsConfirmDeliver() {
    if (!buyer) {
      return;
    }
    setError("");
    setSuccess("");
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EscrowAddress, Escrow.abi, signer);
      try {
        const transaction = await contract.sinapsConfirmDeliver(buyer);
        await transaction.wait();
        setAmountEscrow("");
        setPrestataire("");
        getBalancePayment();
        setSuccess("Paiement transmis suite à une decision de Sinaps ! ");
      } catch (err) {
        setError("Une erreur est survenue.");
      }
    }
  }

  async function getBalancePayment() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }); //peut etre inutile
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(EscrowAddress, Escrow.abi, provider);
      try {
        let overrides = {
          from: accounts[0], //peut etre inutile
        };
        const data = await contract.getBalance(buyer);
        setAmountLocked(String(data));
      } catch (err) {
        setError("Une erreur est survenue.");
      }
    }
  }

  function changeAmountEscrow(e) {
    setAmountEscrow(e.target.value);
  }

  function changeBuyer(e) {
    setBuyer(e.target.value);
  }

  function changePrestataire(e) {
    setPrestataire(e.target.value);
  }

  /////////////////////////////////////////////////function Wallet/////////////////////////////////////////////////

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);
      try {
        let overrides = {
          from: accounts[0],
        };
        const data = await contract.getBalance(overrides);
        setBalance(String(data));
      } catch (err) {
        setError("Une erreur est survenue.");
      }
    }
  }

  async function transfer() {
    if (!amountSend) {
      return;
    }
    setError("");
    setSuccess("");
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend),
        };
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();
        setAmountSend("");
        getBalance();
        setSuccess("Votre argent a bien été transféré sur le portefeuille ! ");
      } catch (err) {
        setError("Une erreur est survenue.");
      }
    }
  }

  async function withdraw() {
    if (!amountWithdraw) {
      return;
    }
    setError("");
    setSuccess("");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
    try {
      const transaction = await contract.withdrawMoney(
        accounts[0],
        ethers.utils.parseEther(amountWithdraw)
      );
      await transaction.wait();
      setAmountWithdraw("");
      getBalance();
      setSuccess("Votre argent a bien été retiré du portefeuille ! ");
      setError("");
    } catch (err) {
      setError("Une erreur est survenue.");
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="logo">
          <i className="fab fa-ethereum"></i>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <h2>
          {balance / 10 ** 18} <span className="eth">eth</span>
        </h2>
        <div className="wallet__flex">
          <div className="Buyer">
            <h3>Consulter un paiement en attente :</h3>
            <input
              type="text"
              placeholder="Addresse du client"
              onChange={changeBuyer}
            />
            <button onClick={getBalancePayment}>
              Afficher le montant verrouillé
            </button>
            <button onClick={sinapsConfirmDeliver}>SinapsConfirmDeliver</button>
          </div>

          <div className="Prestataire">
            <h3>Verrouillez votre paiement :</h3>
            <input
              type="text"
              placeholder="Addresse du prestataire"
              onChange={changePrestataire}
            />
            <input
              type="text"
              placeholder="Montant en Ethers"
              onChange={changeAmountEscrow}
            />
            <button onClick={confirmPayment}>Verrouiller</button>
          </div>

          <div className="confirm">
            <h3>Confirmez la livraison et déverrouillez le paiement !</h3>
            <button onClick={confirmDeliver}>Déverrouiller le paiement</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
