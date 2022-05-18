import React,{useEffect,useState} from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
// import MyComponent from "./MyComponent";
import Web3 from 'web3';
import "./App.css";


// components
import {Typography,notification,message} from 'antd';
import FlightForm from "./components/flightForm/flightForm.js";
import OperationStatus from "./components/operationStatus/index";
import FlightReport from './components/flightReport/index'
import Airlines from './components/airlines/index'

// config
import Config from './config.json'
import FlightSuretyApp from './contracts/FlightSuretyApp'
import FlightSuretyData from './contracts/FlightSuretyData'
import data from './data.json'

const { Title } = Typography;


const drizzle = new Drizzle(drizzleOptions);



const App = () => {

  let flightSuretyApp;
  let flightSuretyData;

  const [passengers, setPassengers] = useState([])
  const [airlines, setAirlines] = useState([])
  const [flights, setFlights] = useState([])

  const [operationalStatus, setOperationalStatus] = useState(false);

  const setupPassengers = (accounts) =>{
    
    let passengerData = [];
    for(let i=0; i<accounts.length; i++){
      passengerData.push({
        name:data['passengers'][i],
        address:accounts[i]
      })
    }
    setPassengers(passengerData);
  }

  const setupAirlines = (accounts) =>{

    let airlinesData=[];
    for(let i = 0; i <= data['airlines'].length-1; i++){
      console.log(accounts[i])
      airlinesData.push({
        address: accounts[i],
        name: data['airlines'][i],
      })
    }
    // console.log(airlinesData)
    setAirlines(airlinesData);
  }

  const setupFlights = (accounts) =>{

    let flightsData = [];
    for(let i=0; i<accounts.length; i++){
      
     let flight = data['flights'][i].flight;
     let timestamp = data['flights'][i].timestamp;
      
      flightsData.push({
        flight:flight,
        timestamp:timestamp,
        airline:  accounts[i]
      });

    }
    setFlights(flightsData);
  }

  const connectToContract = async()=>{
    const config = Config['localhost'];
    const web3 = new Web3(new Web3.providers.HttpProvider(config.url));

    // connect to data and app contract
    flightSuretyApp =  new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
    flightSuretyData =  new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

    // fetch all accounts created by ganache
    const accounts = await web3.eth.getAccounts(); 
    
    const airlineAccounts = accounts.slice(0,5);
    const passengerAccounts = accounts.slice(11,17);
    const flightAccounts = accounts.slice(0,3);

    setupAirlines(airlineAccounts);
    setupPassengers(passengerAccounts);
    setupFlights(flightAccounts);

  }

  const fetchOperationalStatus = async()=>{
   let operationalStatus = await flightSuretyApp.methods.isOperational().call();
   setOperationalStatus(operationalStatus);
  }


  useEffect(() => {
    console.log('Initializing contract ...')
    connectToContract()
    fetchOperationalStatus()
    return () => {
    };
  }, [])
  

        return (
          <div className="app">
            <div className="layout">

              <Title>Flyora</Title>
              <OperationStatus
                status = {operationalStatus}
                />

              <FlightForm
               title={'Insurance'}
               flights={flights}
               btnLabel={'Buy Insurance'}
               />

              <FlightForm
                title={'FlightStatus'}
                flights={flights}
                btnLabel={'Check Flight Status'}
                />
              {/* <FlightReport/> */}
              <Airlines airlines={airlines}/>
            </div>
          </div>
          )
          }


export default App;
