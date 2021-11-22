import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Style component list to style the coins.
const Container = styled.div`
  padding: 0px 20px;
  // Mobile friendly max width so that buttons are elongated too much.
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 38px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

// Interface for the coin data to explain to TypeScript.
interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

// function that will fetch API and return the data.
function HomeCoin() {
  // Create a state and the data is going to look like a CoinInterface.
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);
  
  // fetching the data from the API.
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      // 4000 API returns are reduced to 100 and setState.
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);
  return (
    <Container>
      <Header>
        
        <Title>📀CryptoCoins Data📀</Title>
      </Header>
      {/* if loacing state is true, show <Loader> else show CoinList */}
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {/* To explain, 
          1. Maps coins array retrieved from an API
          2. Send coin.id as a prop to the Coin and Link component.
          3. Each Coin will be rendered on a page with the coin.name.
          */}

          {coins.map((coin) => (
            <Coin key={coin.id}>

              {/* <Link to={{
                 pathname: where to send data to.
                 state: data to send
              }}>*/}

              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default HomeCoin;