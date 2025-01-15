import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import GoogleMap from './components/map';

function App() {
  const [countries, setCountries] = useState([]); // Initialize countries state

  const getTimeZones = async () => {
    const time = new Date();

    const response = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${import.meta.env.VITE_TIME_ZONE_DB}&format=json`);
    const data = await response.json();

    // Filter countries based on the 5 O'Clock condition
    const filteredCountries = data.zones.filter((country) => {
      return (time.getUTCHours() + country.gmtOffset / 3600) % 24 === 17;
    });

    setCountries(filteredCountries); // Update the state with the filtered countries
  };

  useEffect(() => {
    getTimeZones(); // Call getTimeZones when the component mounts
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <Container 
      className="d-flex justify-content-center align-items-center min-vh-100" 
      fluid
      style={{ backgroundColor: '#f8f9fa', padding: '30px' }}
    >
      <Row className="text-center">
        <Col lg={12} md={12} sm={12}>
          <Card className="shadow-lg p-4" style={{ borderRadius: '15px', maxWidth: '900px', margin: 'auto', backgroundColor: 'white' }}>
            <Card.Body>
              <h1 className="mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                IT IS 5 O'CLOCK SOMEWHERE 🍻🍻
              </h1>
              <p style={{ fontSize: '18px', marginBottom: '30px', color: '#6c757d' }}>
                Discover countries where it's 5 o'clock! 🌍
              </p>
              <GoogleMap countries={countries} /> {/* Pass countries as a prop to GoogleMap */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
