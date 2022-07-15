import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useNotification } from "web3uikit";
import { mapTea } from "../utils/mapTea";
import Logo from "./Logo";

const MainPage = () => {
  const { isWeb3Enabled, chainId: chainIdHex, isAuthenticated } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const teaShopAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  //Hooks states(States variables)
  const [allTea, setAllTea] = useState([]);
  const [totalTea, setTotalTea] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  //OnChange Handle
  const handleOnMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  };
  const handleOnNameChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const dispatch = useNotification();

  const amount = ethers.utils.parseEther("1");

  const {
    runContractFunction: buyTea,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: teaShopAddress,
    functionName: "buyTea",
    //msgValue: _amount,
    params: {
      _message: message,
      _name: name,
      _payAmount: ethers.utils.parseEther("0.001"),
    },
  });

  /*View Functions */

  const { runContractFunction: findAllTea } = useWeb3Contract({
    abi: abi,
    contractAddress: teaShopAddress,
    functionName: "getAllOrderTea",
    params: {},
  });

  const { runContractFunction: countTea } = useWeb3Contract({
    abi: abi,
    contractAddress: teaShopAddress,
    functionName: "getTotalTea",
    params: {},
  });

  async function updateUIValues() {
    const findAllTeaFromCall = await findAllTea();
    const countTeaFromCall = await countTea();

    setAllTea(mapTea(findAllTeaFromCall));

    setTotalTea(countTeaFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
  }, [isWeb3Enabled]);

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Coffee Purchased!",
      title: "Transaction Notification",
      position: "topR",
      icon: "ada",
    });
  };

  // Probably could add some error handling
  const handleSuccess = async (tx) => {
    setMessage("");
    setName("");
    await tx.wait();
    updateUIValues();
    handleNewNotification(tx);
  };

  const handleComplete = async (tx) => {
    dispatch({
      type: "info",
      message: "Sending Fund for tea",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      <Logo />
      {teaShopAddress ? (
        <div className="w-full max-w-xs sticky top-3 z-50 ">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                onChange={handleOnNameChange}
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Send the Creator a Message
              </label>

              <textarea
                className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Message"
                id="message"
                onChange={handleOnMessageChange}
                required
              ></textarea>
            </div>

            <div className="flex items-left justify-between">
              <button
                className="bg-green-500 hover:bg-green-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={async () => {
                  await buyTea({
                    onComplete: handleComplete,
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                  });
                }}
                disabled={isLoading || isFetching}
              >
                {isLoading || isFetching ? (
                  <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                  "Support $5"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <p className="text-2xl text-green-600 mb-6">
          You can switch your wallet to Rinkeby Testnet Network to test this
          application.
        </p>
      )}

      {allTea && teaShopAddress ? (
        allTea.map((tea, index) => {
          return (
            <div className="border-l-2 mt-10" key={index}>
              <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-green-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
                {/* <!-- Dot Following the Left Vertical Line --> */}
                <div className="w-5 h-5 bg-green-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

                {/* <!-- Line that connecting the box with the vertical line --> */}
                <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>

                {/* <!-- Content that showing in the box --> */}
                <div className="flex-auto">
                  <h1 className="text-md">Supporter: {tea.name}</h1>
                  <h1 className="text-md">Message: {tea.message}</h1>
                  <h3>Address: {tea.address}</h3>
                  <h1 className="text-md font-bold">
                    TimeStamp: {tea.timestamp.toString()}
                  </h1>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No data avalaible</p>
      )}
    </main>
  );
};

export default MainPage;
