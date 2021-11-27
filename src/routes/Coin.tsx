import { useEffect, useState } from "react";
import { Switch, Route, useLocation, useParams } from "react-router";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import ApexChart from "react-apexcharts";

// Animation
const comeupAnimation = keyframes`
  0% {
    transform: none;
    opacity: 0;
  }
  1% {
    transform: translateY(-5px);
    opacity: 0;
  }
  100% {
    transform: none;
    opacity: 1;
  }
`;

// styled-components for the coin page.
const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;
const Loader = styled.span`
  text-align: center;
  display: block;
`;
const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const linkStyle = {
  margin: "1rem",
  textDecoration: "none",
  color: 'blue'
};


// styled components for the coin data display section.
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const LinkItem = styled.main`
  width: 100%;
  height: 50px;
  background-color: white;
  color: black;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin: 10px 0;
  padding: 20px;
  transform: translateY(-5px);
  opacity: 0;
  animation: ${comeupAnimation} 1s linear forwards;
`;
const Description = styled.p`
  margin: 20px 0px;
`;

const Tab = styled.div`
  margin: 20px auto;
  text-align: center;
  text-transform: uppercase;
  font-size: 15px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 7px 0px;
  border-radius: 10px;
  box-align: center;

`;

// Interface for the coin page route params.
interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}

// Interface for API data.
interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
  links_extended: Array<{url:string, type:string}>;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}


interface PriceHistoricalData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Coin() {
  const [loading, setLoading] = useState(true);
  // Get the coin id and state from url.
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
  const [coinHistory, setCoinHistory] = useState<PriceHistoricalData[]>();


  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      
      // API fetch for historical coin data.
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - 60 * 60 * 24 * 7 * 2;

      const coinHistory = await (
        await fetch(
          `https://api.coinpaprika.com/v1/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
        )
        ).json();
      setInfo(infoData);
      setPriceInfo(priceData);
      setCoinHistory(coinHistory);
      // info.links.map((link) => console.log(link))



      setLoading(false);
    })();
  }, [coinId]);

  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${priceInfo?.quotes.USD.price.toFixed(2)}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
            
          </Overview>
          <Tab>
            <div>CHART (past 2 weeks)</div>
            <div>
        <ApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: coinHistory?.map((price) => price.close),
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: { show: false },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: {
              title: {text: "Price"},
              labels: { 
                show: true,
                formatter: function (value) {
                  return "$ " + value.toFixed(0); // The formatter function overrides format property
                },  
              },
            },
            xaxis: {
              title: {text: "Date"},
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: true },
              type: "datetime",
              categories: coinHistory?.map((price) => price.time_close),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            
          }}
        />
    </div>
          </Tab>
          <Tab>
            <div>Information on {info?.name}</div>
          </Tab>
            {info ? info.links_extended.map((link) => <LinkItem><a href={link.url} rel="noreferrer" target="_blank">{link.url}</a></LinkItem>) : console.log("") }
        </>
      )}
    </Container>
  );
}


          
            
    

          
    
    
  
export default Coin;