'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TableManager() {

  const[totalSeats, setTotalSeats] = useState<number>(0);
  const[premiumSeats, setPremiumSeats] = useState<number>(0);
  const[hostId, setHostId] = useState<number>(0);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [hostKey, setHostKey] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);

  const urlCreateTable = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/createTable";

  const handleCreateTable = async () => {

    try {
      const response = await axios.post(urlCreateTable, {
        host_id: hostId,
        total_seats: totalSeats,
        premium_seats: premiumSeats,
      });

      const { statusCode, body } = response.data;

      console.log(response.data);

      if (statusCode === 200) {
        alert("Successfully Created Table and Seats!");

      } else {
        alert("Failed to create table and seats");
      }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }
  };

  const tables = [
    { id: 1, name: 'Table 1' },
    { id: 2, name: 'Table 2' },
    { id: 3, name: 'Table 3' },
  ];
  const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
  const [waitlist, setWaitlist] = useState<string[]>([]);

  const handleTableSelect = (id: number) => {
    setSelectedTable(id);
  };

  const addNameToWaitlist = (name: string) => {
    setWaitlist((prev) => [...prev, name]);
  };

  const handleNameClick = (name: string) => {
    console.log(`Name clicked: ${name}`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHostKey(e.target.value);
  };

  const handleKeySubmit = () => {
    setSubmit(true);
  }

  const handleKeyClear = () => {
    setSubmit (false);
    setHostKey("");
  }

  const handleDateClear = () => {
    setSelectedDate("");
  }

  const handleTotalSeatsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTotalSeats(Number(e.target.value));
  };
  
  const handlePremiumSeatsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPremiumSeats(Number(e.target.value));
  };  

  const handleHostIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setHostId(value);
  }

  if (selectedDate === ""){
    return(
      <div>
        <input type="text" value={hostKey} onChange={handleKeyChange}></input>
        <button onClick={handleKeySubmit}>Submit</button>
        <button onClick={handleKeyClear}>Clear</button>
        <div className="date-picker-container">
          <label htmlFor="select-date">Select Date:</label>
          <input 
            type="date" 
            id="select-date" 
            value={selectedDate} 
            onChange={handleDateChange} 
          />
        </div>
        <button onClick={handleDateClear}>Clear</button>
        <label>Total Seats</label>
        <select onChange={(e) => handleTotalSeatsChange(e)} value={totalSeats}>
          {[...Array(8)].map((_, index) => (
            <option key={index} value={index + 2}>
              {index + 2}
            </option>
          ))}
        </select>

        <label>Premium Seats</label>
        <select
          onChange={(e) => handlePremiumSeatsChange(e)}
          value={premiumSeats}
          disabled={totalSeats === 0}
        >
          {[...Array(totalSeats + 1)].map((_, index) => (
            <option key={index} value={index}>
              {index}
            </option>
          ))}
        </select>

        <label>Your Host Id</label>
        <input
          className="host-id"
          type="text"
          placeholder="Your Host Id"
          id="host-id"
          name="host-id"
          required
          onChange={handleHostIdChange}
        />

        <button onClick={handleCreateTable}>Create Table</button>


      </div>
    );
  }

  if (selectedTable === null) {
    return (
      <div>
          <input type="text" value={hostKey} onChange={handleKeyChange}></input>
          <button onClick={handleKeySubmit}>Submit</button>
          <button onClick={handleKeyClear}>Clear</button>
          <div className="date-picker-container">
            <label htmlFor="select-date">Select Date:</label>
            <input 
              type="date" 
              id="select-date" 
              value={selectedDate} 
              onChange={handleDateChange} 
            />
          </div>
          <button onClick={handleDateClear}>Clear</button>
        <div className="table-list">
          <h1>Select a Table</h1>
          <ul>
            {tables.map((table) => (
              <li key={table.id}>
                <button onClick={() => handleTableSelect(table.id)}>{table.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Table Details Screen
  return (
    <div className="container">
      <button onClick={() => setSelectedTable(null)}>Back to Table List</button>
      <h1>Details for {tables.find((table) => table.id === selectedTable)?.name}</h1>
      
      <div className="table-container">
        <div className="table">
          {names.map((name, index) => {
            const angle = (360 / names.length) * index;
            const x = Math.ceil(250 + 250 * Math.cos((angle * Math.PI) / 180));
            const y = Math.ceil(125 + 125 * Math.sin((angle * Math.PI) / 180));

            return (
              <div
                key={index}
                className={`name position-${index + 1}`}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <button onClick={() => handleNameClick(name)}>{name}</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="waitlist-container">
        <h2>Waitlist</h2>
        <button onClick={() => addNameToWaitlist('New Name')}>Add Name</button>
        <table className="waitlist-table">
          <tbody>
            {waitlist.map((name, index) => (
              <tr key={index}>
                <td>{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
