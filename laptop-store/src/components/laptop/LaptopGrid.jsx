import { Card, Col, Placeholder, Row } from 'react-bootstrap';
import LaptopCard from './LaptopCard';

export function LaptopCardSkeleton() {
  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Col key={index}>
          <Card className="h-100">
            <Placeholder as={Card.Img} animation="wave" variant="secondary" style={{ height: 180 }} />
            <Card.Body>
              <Placeholder as={Card.Title} animation="wave" className="w-75" />
              <Placeholder as={Card.Text} animation="wave" className="w-50" />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default function LaptopGrid({ laptops, loading = false, emptyMessage }) {
  if (loading) {
    return <LaptopCardSkeleton />;
  }

  if (!laptops || laptops.length === 0) {
    return <div className="text-center py-5 text-secondary">{emptyMessage || 'Không tìm thấy laptop phù hợp'}</div>;
  }

  return (
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {laptops.map((laptop) => (
        <Col key={laptop.id}>
          <LaptopCard laptop={laptop} />
        </Col>
      ))}
    </Row>
  );
}
