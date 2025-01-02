'use client';

import React, { useState } from "react";

export default function NewPage() {
  const [names, setNames] = useState(["empty", "empty", "empty", "empty", "empty", "empty"]);
  const [waitlist, setWaitlist] = useState<string[]>([]);

  function handleNameClick(name: string) {
    alert(`${name} clicked`);
  }

  function addNameToWaitlist(name: string) {
    setWaitlist((prevWaitlist) => [...prevWaitlist, name]);
  }

  return (
    <div className="container">
      <div className="table-container">
        <div className="table">
          {names.map((name, index) => {
            const angle = (360 / names.length) * index;
            const x = 150 + 150 * Math.cos((angle * Math.PI) / 180);
            const y = 75 + 75 * Math.sin((angle * Math.PI) / 180);

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
        <button onClick={() => addNameToWaitlist("New Name")}>Add Name</button>
        <table className="waitlist-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {waitlist.map((name, index) => (
              <tr key={index}>
                <td>{name}</td>
                <td>
                  <button onClick={() => handleNameClick(name)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
