import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import Form from './components/Form';
import { /*wallet,*/ getAllCampaigns } from "./solana";

export async function connectWallet() {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString()
    );

    //setWalletAddress(response.publicKey.toString());

  }
};

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [route, setRoute] = useState(0);
  const [cards, setCards] = useState([]);
  

  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          /*
         * The solana object gives us a function that will allow us to connect
         * directly with the user's wallet!
         */
          const response = await solana.connect({ OnlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          /*
         * Set the user's publicKey in state to be used later!
         */
          setWalletAddress(response.publicKey.toString());
          // setWallet(response);
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  
  
  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  useEffect(() => {
    if(walletAddress) {
      console.log("Connected with Wallet...");
    }
    
  }, [walletAddress]);
  useEffect(() => {
    getAllCampaigns().then((val) => {
      setCards(val);
      console.log(val);
    });
  }, []);
  return (
    <div className="ui container">
      <Header setRoute={setRoute} />
      {route === 0 ?
        <div>{
          cards.map((e, idx) => (
            <Card
              key={e.pubId.toString()}
              data={{
                title: e.name,
                description: e.description,
                amount: (e.amount_donated).toString(),
                image: e.image_link,
                id: e.pubId,
              }}
              setCards={setCards} />
          ))
        }
        </div>
        :
        <Form setRoute={(e) => {
          setRoute(e);
            getAllCampaigns().then((val) => {
            setCards(val);
           });
        }} />
      }
    </div>
  );
}

export default App;