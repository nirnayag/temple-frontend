import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PriestsList = () => {
  // Sample priests data based directly on SSVT website
  const priests = [
    {
      id: 1,
      name: "Sri Narayanachar Lakshminarasimha Digalakote",
      title: "Vaishnava Pancharatra Aagama Priest",
      origin: "Karnataka, India",
      background: "Sri Narayanachar is a vaishnava pancharatra aagama priest at SSVT. He hails from Digalakote, Karnataka. He is the disciple of Shri Savyasachi Swamigal, Vaishnava Acharya of SSVT. He has been trained in Pancharatra Aagama and has training in satras including Poorva Pryogas, Srardha Pryogas, and Aparaprayogas. He joined SSVT in May 1992. He performs all the aagamic activities at SSVT and always involves devotees in when he performs either archanas or kalyanotsavams.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+1",
      languages: ["Kannada", "Telugu", "Tamil", "Hindi", "Sanskrit", "English"]
    },
    {
      id: 2,
      name: "Sri Easwaran Nampoothiri",
      title: "Tantrik Priest",
      origin: "Kerala, India",
      background: "Sri. Easwaran Nampoothiri hails from Allapuzha, Kerala. He is Tantrik priest trained in Kerala Tantrik pujas through a family hereditary system under his grandfather and father. He has performed Thanthrik pujas and prtishtapanams in many states in India. Melsanthi at Sabarimalai Temple in 1996-1997 and at Sabarimalai-Mallikapuram temple in 1985-86 are something he cherishes. He joined SSVT in September 2000 as Tantrik priest. He performs all the pujas at the Ayyappan sannidhi and serves other deities as well.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+2",
      languages: ["Malayalam", "Tamil", "Hindi", "English"]
    },
    {
      id: 3,
      name: "Sri Janakiram Sarma Marthi",
      title: "Smartha Vaidhika Priest",
      origin: "Andhra Pradesh, India",
      background: "Sri. Janakiram Marthi hails from Andhra Pradesh, India. He is smartha vaidhika priest who had his veda paatam at \"Gayathri Smaartha Vedapaatashaala\" at Srisailam, Andhra Pradesh under his father Shri Venkatarama Sarma and later under Sri Sailam Nitya Agnihotri Satyanarayana Somayajulu. Prior to joining SSVT in October 2005 he was a vaidika priest in Narasaropet, Andhra. He has participated in Kotivarthi Sahit Lakshminarayana Deepotsavam, Varanasi and in Rudra Yagam & Subramanya Prathishta, Rameswaram.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+3",
      languages: ["Telugu", "Hindi", "English", "Sanskrit"]
    },
    {
      id: 4,
      name: "Sri Sivasubramaniyan Ganesa Gurukkal",
      title: "Saivagama Priest",
      origin: "Tamil Nadu, India",
      background: "Sri Sivasubramanyan Ganesa Gurukkal hails from Tiruvannamalai, Tamil Nadu. He is trained in Saivagama under his Guru Dr. Somasundara Sivachariyar from Sri Lokambika Vedha Sivaagama Vidyalaya, Tiruppalaivanam, Tamilnadu. He is trained in Poorva Prayoga and Shraddha Prayogas. He served the deities in Sri Shishta Gurunadhar Temple, Sri Arunachaleswar Temple in Tamilnadu for over 15 years. Before joining SSVT in July 2011 as Sivaagama Priest he was with Sri Lakshmi Temple in Boston.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+4",
      languages: ["Tamil", "English"]
    },
    {
      id: 5,
      name: "Sri Shankara Gurukkal",
      title: "Saivagama Priest",
      origin: "Tamil Nadu, India",
      background: "Sri Sankaran Gurukkal hails from Tiruveezhimizhalai, Tamilnadu. He is trained in Saivagama under his Guru Sivasri Visvanatha Sivachariyar from Sri Vedha Sivaagama Patasali, Allur, Tamilnadu. He is trained in Poorva Prayoga and Shraddha Prayogas. He has served the Deities for more than 17 years in Mangala Vinayagar Temple, Tambaram before serving Murugan Temple (MTNA) Lanham in 2008 - 2009. After a small break In India he joined SSVT as saivagama priest in March 2010.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+5",
      languages: ["Tamil", "Hindi", "Sanskrit"]
    },
    {
      id: 6,
      name: "Sree Venkatacharyulu Kumanduri",
      title: "Vaishnava Pancharatra Aagama Priest",
      origin: "Andhra Pradesh, India",
      background: "Sri Venkatacharyulu Kumanduri is a vaishnava pancharatra aagama priest at SSVT. He hails from Kesavaram Andhra Pradesh. He finished his veda aagama studies from Sri Pancharaatra Aagama kSalashaala, Jeeyar Educational Trust, Jaggayyapet, Andhra Pradesh under his Guru Srinivasacharya Samudrala. He also has a B.Com degree from Andhra University. He has served in different temples in Hyderabad for 10 years before joining SSVT in May 2011.",
      image: "https://placehold.co/150x150/800020/FFFFFF?text=Priest+6",
      languages: ["Telugu", "Tamil", "Hindi", "English"]
    }
  ];

  return (
    <Container className="my-5">
      <h1 className="section-heading mb-4">Our Temple Priests</h1>
      <p className="text-center mb-5">
        Our priests are highly trained in various Vedic traditions and perform all rituals 
        with devotion and precision according to the sacred texts. They conduct daily pujas,
        special ceremonies, and provide spiritual guidance to devotees.
      </p>

      {priests.map(priest => (
        <Card className="mb-5 border-0 shadow-sm" key={priest.id}>
          <Card.Body>
            <h3 className="mb-3 text-temple">{priest.name}</h3>
            <Row>
              <Col md={3} className="text-center mb-4 mb-md-0">
                <img
                  src={priest.image}
                  alt={priest.name}
                  className="priest-image"
                />
                <p className="mt-3 priest-title">{priest.title}</p>
              </Col>
              <Col md={9}>
                <p className="mb-3">{priest.background}</p>
                <p>
                  <strong>Languages:</strong> {priest.languages.join(", ")}
                </p>
                <p className="mt-2 mb-0">
                  <strong>Origin:</strong> {priest.origin}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      <div className="mt-5 p-4 bg-light rounded">
        <h3 className="text-temple mb-3">Request Priest Services</h3>
        <p>
          Our priests are available to perform various religious ceremonies at the temple 
          or at your residence. Please use our puja services page to schedule ceremonies or 
          contact the temple office for more information.
        </p>
        <p className="mb-0">
          <strong>Contact:</strong> priest-services@temple.org | (123) 456-7890
        </p>
      </div>
    </Container>
  );
};

export default PriestsList; 