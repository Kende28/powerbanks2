import { useEffect, useState } from "react";

export function PBList() {
  const [powerbanks, setPowerbanks] = useState([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [batteryTime, setBatteryTime] = useState(0);
  const [chargeDuration, setChargeDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [available, setAvailable] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPBs, setFilteredPBs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPB = {
      name: name,
      brand: brand,
      battery_time: batteryTime,
      charge_duration: chargeDuration,
      cost: cost,
      available: available,
    };
    try {
      const response = await fetch("http://localhost:3000/powerbanks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPB),
      });
      fetchPBs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (powerbankId: number) => {
    const res = await fetch(`http://localhost:3000/powerbanks/${powerbankId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    setPowerbanks(
      powerbanks.filter((powerbank) => powerbank.id !== powerbankId)
    );
  };

  const handleAvailable = async (powerbankId: number) => {
    const res = await fetch(
      `http://localhost:3000/powerbanks/available/${powerbankId}`,
      {
        method: "PUT",
      }
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    fetchPBs();
  };

  const handleUnavailable = async (powerbankId: number) => {
    const res = await fetch(
      `http://localhost:3000/powerbanks/unavailable/${powerbankId}`,
      {
        method: "PUT",
      }
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    fetchPBs();
  };

  const handleCDurationIncrease = async (powerbankId: number) => {
    const res = await fetch(
      `http://localhost:3000/powerbanks/addcduration/${powerbankId}`,
      {
        method: "PUT",
      }
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    fetchPBs();
  };

  const handleCDurationDecrease = async (powerbankId: number) => {
    const res = await fetch(
      `http://localhost:3000/powerbanks/removecduration/${powerbankId}`,
      {
        method: "PUT",
      }
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    fetchPBs();
  };

  const handleBTimeIncrease = async (powerbankId: number) => {
    const res = await fetch(
      `http://localhost:3000/powerbanks/addbtime/${powerbankId}`,
      {
        method: "PUT",
      }
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    fetchPBs();
  };

  const handleBTimeDecrease = async (powerbankId: number) => {
    const res = await fetch(
      `http://localhost:3000/powerbanks/removebtime/${powerbankId}`,
      {
        method: "PUT",
      }
    );
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    fetchPBs();
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = powerbanks.filter(
      (powerbanks) =>
        powerbanks.name.toLowerCase().includes(term) ||
        powerbanks.brand.toLowerCase().includes(term)
    );
    setFilteredPBs(filtered);
  };

  const handleSortPBs = async (key: string, direction: "asc" | "desc") => {
    const sortedPBs = [...filteredPBs].sort((a, b) => {
      if (a[key] > b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] < b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const fetchPBs = async () => {
    try {
      const res = await fetch("http://localhost:3000/powerbanks");
      const data = await res.json();
      setPowerbanks(data);
      setFilteredPBs(data)
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
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Name:</label>
              </td>
              <td>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Brand:</label>
              </td>
              <td>
                <input
                  type="text"
                  name="brand"
                  required
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Battery timer(h):</label>
              </td>
              <td>
                <input
                  type="number"
                  name="batteryTime"
                  value={batteryTime}
                  onChange={(e) => {
                    setBatteryTime(parseInt(e.target.value));
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Charge time(h):</label>
              </td>
              <td>
                <input
                  type="number"
                  name="chargeDuration"
                  value={chargeDuration}
                  onChange={(e) => {
                    setChargeDuration(parseInt(e.target.value));
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Cost(Ft):</label>
              </td>
              <td>
                <input
                  type="number"
                  name="cost"
                  value={cost}
                  onChange={(e) => {
                    setCost(parseInt(e.target.value));
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Available:</label>
              </td>
              <td>
                <select
                  name="available"
                  onChange={(e) => setAvailable(parseInt(e.target.value))}
                >
                  <option value={1}>Available</option>
                  <option value={0}>Unavailable</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">New powerbank</button>
      </form>
      <h2>Powerbanks</h2>
      <form>
        <input
          type="text"
          placeholder="Kereséshez írjon ide!"
          value={searchTerm}
          onChange={handleSearch}
        />
      </form>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">
              Name{" "}
              <span style={{ cursor: "pointer" }} onClick={() => {}}>
                🔼
              </span>{" "}
              <span style={{ cursor: "pointer" }} onClick={() => {}}>
                🔽
              </span>
            </th>
            <th scope="col">Brand</th>
            <th scope="col">Battery time</th>
            <th scope="col">Charge duration</th>
            <th scope="col">Cost</th>
            <th scope="col">Available</th>
          </tr>
        </thead>
        <tbody>
          {filteredPBs.map((powerbank) => (
            <tr key={powerbank.id}>
              <td>{powerbank.id}</td>
              <td>{powerbank.name}</td>
              <td>{powerbank.brand}</td>
              <td>
                {powerbank.battery_time}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleBTimeIncrease(powerbank.id);
                  }}
                >
                  ➕
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleBTimeDecrease(powerbank.id);
                  }}
                >
                  ➖
                </span>
              </td>
              <td>
                {powerbank.charge_duration}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleCDurationIncrease(powerbank.id);
                  }}
                >
                  ➕
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleCDurationDecrease(powerbank.id);
                  }}
                >
                  ➖
                </span>
              </td>
              <td>{powerbank.cost}</td>
              <td>
                {powerbank.available ? "Available" : "Unavailable"}
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleAvailable(powerbank.id);
                  }}
                >
                  ✅
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleUnavailable(powerbank.id);
                  }}
                >
                  ❎
                </span>
              </td>
              <td>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    handleDelete(powerbank.id);
                  }}
                >
                  ❌
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
