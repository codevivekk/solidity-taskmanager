import { ethers } from "ethers";
import TASK_MANAGER_ABI from "./app/abi/abi.json"
export const CONTRACT_ADDRESS = "0xCd192f9F0D359472007707049532b64eCEbF3E0d"



async function connectWallet() {
  if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Ask user to connect
      const signer = provider.getSigner();
      console.log("Connected Address:", await signer.getAddress());
  } else {
      console.error("No Ethereum provider found. Install MetaMask!");
  }
}

connectWallet();

export const getContract = async () => {
  if (!window.ethereum) return null;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, TASK_MANAGER_ABI.abi, signer);
};

export const addTask = async (title, description) => {
  try {
    const contract = await getContract();
    const tx = await contract.addTask(title, description);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error adding task:", error);
    return false;
  }
};


export const getTasks = async () => {
  try {
    const contract = await getContract();
    return await contract.getTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const updateTask = async (taskId, title, completed) => {
  try {
    const contract = await getContract();
    const tx = await contract.updateTask(taskId, title, completed);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const contract = await getContract();
    const tx = await contract.deleteTask(taskId);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};
