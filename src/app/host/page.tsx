'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TableManager() {
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [premiumSeats, setPremiumSeats] = useState<number>(0);
  const [hostId, setHostId] = useState<number | null>(null);
  const [hostKey, setHostKey] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const urlCreateTable = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/createTable";
  const urlGetHostTableInfo = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/getHostTableInfo";
  const urlDeleteTable = "https://j08uqzcsf4.execute-api.us-east-1.amazonaws.com/main/deleteTable";

  const handleCreateTable = async () => {
    try {
      setLoading(true);
      const response = await axios.post(urlCreateTable, {
        host_id: hostId,
        total_seats: totalSeats,
        premium_seats: premiumSeats,
      });
      const { statusCode } = response.data;
      alert(statusCode === 200 ? "Successfully Created Table and Seats!" : "Failed to create table and seats");
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
      getHostTableInfo();
    }
  };

  const handleDeleteTable = async () => {
    try {
      console.log(selectedTable);
      setLoading(true);
      const response = await axios.post(urlDeleteTable, {
        table_id: selectedTable
      });
      const { statusCode } = response.data;
      if(statusCode === 200){
        setSelectedTable(null);
      }
      alert(statusCode === 200 ? "Deleted table" : "Failed to delete table");
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
      getHostTableInfo();
    }
  };

  const getHostTableInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.post(urlGetHostTableInfo, { host_id: hostId });
      const { statusCode, body } = response.data;
      if (statusCode === 200) {
        setTables(body);
      } else {
        alert("Failed to retrieve table information");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (id: number) => setSelectedTable(id);

  const renderTableList = () => (
    <div>
      <h1>Select a Table</h1>
      <ul>
        {tables.map((table) => (
          <li key={table.table_id}>
            <button onClick={() => handleTableSelect(table.table_id)}>
              {table.total_seats} seats
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderTableDetails = () => {
    const table = tables.find((t) => t.table_id === selectedTable);
    if (!table) return null;

    return (
      <div>
        <button onClick={() => setSelectedTable(null)}>Back to Table List</button>
        <h1>Details for {table.table_id}</h1>
        <p>Total Seats: {table.total_seats}</p>
        <p>Premium Seats: {table.premium_seats}</p>
        <h2>Seats</h2>
        <ul>
          {table.seats.map((seat: any) => (
            <li key={seat.seat_id}>
              Seat ID: {seat.seat_id}, Premium: {seat.premium}, Occupied: {seat.player_id}
            </li>
          ))}
        </ul>
        <button onClick={handleDeleteTable}>Delete Table</button>
      </div>
    );
  };

  const handleSetHostId = () => {
    const numericHostId = parseInt(hostKey);
    if (!isNaN(numericHostId)) {
      setHostId(numericHostId);
    } else {
      alert("Please enter a valid numeric Host ID.");
    }
  };

  const renderLoading = () => <p>Loading...</p>;

  useEffect(() => {
    if (hostId) {
      getHostTableInfo();
    }
  }, [hostId]);

  return (
    <div>
      <label>Enter Host ID</label>
      <input type="string" value={hostKey} onChange={(e) => setHostKey(e.target.value)} />
      <button onClick={handleSetHostId}>Set Host ID</button>
      {hostId && (
        <div>
          <label>Total Seats</label>
          <select onChange={(e) => setTotalSeats(Number(e.target.value))} value={totalSeats}>
            {[...Array(8)].map((_, index) => (
              <option key={index} value={index + 2}>
                {index + 2}
              </option>
            ))}
          </select>
          <label>Premium Seats</label>
          <select
            onChange={(e) => setPremiumSeats(Number(e.target.value))}
            value={premiumSeats}
            disabled={totalSeats === 0}
          >
            {[...Array(totalSeats + 1)].map((_, index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
          <button onClick={handleCreateTable} disabled={loading}>
            {loading ? "Creating..." : "Create Table"}
          </button>
          {loading && renderLoading()}
          {selectedDate === "" && selectedTable === null && renderTableList()}
          {selectedTable !== null && renderTableDetails()}
        </div>
      )}
    </div>
  );
}
