import "./index.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function SingleTicket() {
  const [match, setMatch] = useState(null);
  const { id } = useParams();
  const [formattedDate, setFormattedDate] = useState('');
  const [ticketCount, setTicketCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/matches/${id}`);
        setMatch(response.data.matches);
      } catch (error) {
        console.error(error);

        // Handle 404 response, for example, redirect to a 404 page or show an error message
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (match && match.utcDate) {
      const dateObject = new Date(match.utcDate);
      const formattedDate = `${(dateObject.getUTCDate()).toString().padStart(2, '0')}/${(dateObject.getUTCMonth() + 1).toString().padStart(2, '0')}/${dateObject.getUTCFullYear()} ${dateObject.getUTCHours().toString().padStart(2, '0')}:${dateObject.getUTCMinutes().toString().padStart(2, '0')}`;
      setFormattedDate(formattedDate);
    }
  }, [match]);

  const handleIncrement = () => {
    setTicketCount(ticketCount + 1);
  };

  const handleDecrement = () => {
    if (ticketCount > 0) {
      setTicketCount(ticketCount - 1);
    }
  };

  return (
    <div>
      <h2 className="page-title">Game Details</h2>
      {match !== null ? (
        <div className="competition">
          <div className="competition-details">
            <img className="country-flag" src={match.area.flag} alt="Country Flag" />
            <p>{match.area.name}: {match.competition.name}</p>
          </div>
          <div className="date-container">
            <p className="date-game">{formattedDate}</p>
          </div>
          <div className="game-details">
            <div className="team-container">
              <div className="team-details">
                <img className="team-flag" src={match.homeTeam.crest} alt="Home Team Crest" />
                <p>{match.homeTeam.name}</p>
              </div>
              <div>
                <p><b> - </b></p>
              </div>
              <div className="team-details">
                <img className="team-flag" src={match.awayTeam.crest} alt="Away Team Crest" />
                <p>{match.awayTeam.name}</p>
              </div>
            </div>
          </div>
          <div className="ticket-container">
            <p>Tickets: {ticketCount}</p>
            <button onClick={handleIncrement}>+</button>
            <button onClick={handleDecrement}>-</button>
          </div>
        </div>
      ) : (
        <p>Match not found or has ended.</p>
      )}
    </div>
  );
}
