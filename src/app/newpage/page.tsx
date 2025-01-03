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
        <button onClick={() => addNameToWaitlist("New Name")}>Add Name</button>
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
