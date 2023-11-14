import "./index.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../Components/CartContext";
import TicketJSON from "../../assets/Ticket.json";

export default function SingleTicket() {
  const [matches, setMatches] = useState(null);
  const { id } = useParams();
  const [formattedDate, setFormattedDate] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const navigate = useNavigate();
  const { cart, dispatch } = useCart() || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/matches`);
        const selectedMatch = response.data.matches.find((m) => m.id === parseInt(id));
        setMatches(selectedMatch);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (matches && matches.utcDate) {
      const dateObject = new Date(matches.utcDate);
      const formattedDate = `${(dateObject.getUTCDate()).toString().padStart(2, '0')}/${(dateObject.getUTCMonth() + 1).toString().padStart(2, '0')}/${dateObject.getUTCFullYear()} ${dateObject.getUTCHours().toString().padStart(2, '0')}:${dateObject.getUTCMinutes().toString().padStart(2, '0')}`;
      setFormattedDate(formattedDate);
    }
  }, [matches]);

  const handleIncrement = () => {
    setTicketCount(ticketCount + 1);
  };

  const handleDecrement = () => {
    if (ticketCount > 0) {
      setTicketCount(ticketCount - 1);
    }
  };

  const handleAddToCart = () => {
    const ticket = {
      homeTeam: matches.homeTeam.name,
      awayTeam: matches.awayTeam.name,
      formattedDate: formattedDate,
      quantity: ticketCount,
    };

    // Save the ticket information to localStorage using the new variable name
    const existingCart = JSON.parse(localStorage.getItem(TicketJSON)) || [];
    const newCart = [...existingCart, ticket];
    localStorage.setItem(TicketJSON, JSON.stringify(newCart));

    // Dispatch an action to add the ticket to the existing cart
    dispatch({ type: "SET_CART", payload: newCart });
  };

  return (
    <div>
      <h2 className="page-title">Game Details</h2>
      {matches !== null ? (
        <div className="competition">
          <div className="competition-details">
            <img className="country-flag" src={matches.area.flag} alt="Country Flag" />
            <p>{matches.area.name}: {matches.competition.name}</p>
          </div>
          <div className="date-container">
            <p className="date-game">{formattedDate}</p>
          </div>
          <div className="game-details">
            <div className="team-container">
              <div className="team-details">
                <img className="team-flag" src={matches.homeTeam.crest} alt="Home Team Crest" />
                <p>{matches.homeTeam.name}</p>
              </div>
              <div>
                <p> vs </p>
              </div>
              <div className="team-details">
                <img className="team-flag" src={matches.awayTeam.crest} alt="Away Team Crest" />
                <p>{matches.awayTeam.name}</p>
              </div>
            </div>
          </div>
          <div className="ticket-container">
            <p>Tickets: {ticketCount}</p>
            <button onClick={handleIncrement}>+</button>
            <button onClick={handleDecrement}>-</button>
            <div className="add-button">
              <button onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Match not found or has ended.</p>
      )}
    </div>
  );
}
