import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ onLogout }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddEvent = () => {
    fetch('https://your-json-server/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => setEvents([...events,data]))
      .catch((error) => console.error(error));

    setNewEvent({ title: '', date: '', description: '' });
  };

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    // Add some events to the table
    setEvents([
      {
        id: 1,
        title: 'Guest Lecture on React',
        date: '2023-06-10',
        description: 'A guest lecture on React by John Doe.',
      },
      {
        id: 2,
        title: 'Workshop on Node.js',
        date: '2023-07-15',
        description: 'A workshop on Node.js by Jane Doe.',
      },
    ]);
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logout clicked");
    onLogout();
  };

  return (
    <Card style={{ backgroundColor: '#f5f5f5', margin: '20px' }}>
      <CardHeader
        title="Welcome to Guest Lecture Management System Lecturer"
        style={{ backgroundColor: '#3f51b5', color: 'white', textAlign: 'center' }}
        action={<Button color="inherit" onClick={handleLogout}>Logout</Button>}
      />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box>
              <h2>Calendar</h2>
              <Calendar />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <h2>Upcoming Events</h2>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Box>
              <table style={{ backgroundColor: '#61dafb' }}>
                <thead>
                  <tr>
                    <th style={{ paddingRight: '100px' }}>Title</th>
                    <th style={{ paddingRight: '100px' }}>Date</th>
                    <th style={{ paddingRight: '150px' }}>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id} onClick={() => handleOpenModal(event)}>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.description}</td>
                      <td style={{ textAlign: 'right' }}>
                       <Button variant="outlined" color="primary" onClick={() => handleOpenModal(event)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Box mt={2}>
                <h2>Add Event</h2>
                <form>
                  <TextField
                    label="Title"
                    variant="outlined"
                    size="small"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px' }}
                  />
                  <TextField
                    label="Date"
                    variant="outlined"
                    size="small"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px' }}
                  />
                  <TextField
                    label="Description"
                    variant="outlined"
                    size="small"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    style={{ marginRight: '10px' }}
                  />
                  <Button variant="contained" color="primary" onClick={handleAddEvent}>
                    Add
                  </Button>
                </form>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <Modal open={Boolean(selectedEvent)} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedEvent && (
            <>
              <Typography variant="h5" gutterBottom>
                {selectedEvent.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: {selectedEvent.date}
              </Typography>
              <Typography variant="body1">{selectedEvent.description}</Typography>
            </>
          )}
        </Box>
      </Modal>
    </Card>
  );
};