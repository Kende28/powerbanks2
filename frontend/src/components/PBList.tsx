import { useEffect, useState } from "react";

export function PBList() {
  const [powerbanks, setPowerbanks] = useState([]);
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [batteryTime, setBatteryTime] = useState(0)
  const [chargeDuration, setChargeDuration] = useState(0)
  const [cost, setCost] = useState(0)
  const [available, setAvailable] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPB = {
        name: name,
        brand: brand,
        batteryTime: batteryTime,
        chargeDuration: chargeDuration,
        cost: cost,
        available: available
    }
  }

  const fetchPBs = async () => {
    try {
      const res = await fetch("http://localhost:3000/powerbanks");
      const data = await res.json();
      setPowerbanks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPBs();
  }, []);
  return (
    <>
      <h2>Powerbank Add</h2>
      <form onSubmit={handleSubmit}></form>
      <h2>Powerbanks</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Brand</th>
            <th scope="col">Battery time</th>
            <th scope="col">Charge duration</th>
            <th scope="col">Cost</th>
            <th scope="col">Available</th>
          </tr>
        </thead>
        <tbody>
          {powerbanks.map((powerbank) => (
            <tr key={powerbank.id}>
              <td>{powerbank.id}</td>
              <td>{powerbank.name}</td>
              <td>{powerbank.brand}</td>
              <td>{powerbank.battery_time}</td>
              <td>{powerbank.charge_duration}</td>
              <td>{powerbank.cost}</td>
              <td>{powerbank.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
