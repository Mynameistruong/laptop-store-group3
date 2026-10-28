import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Offcanvas, Pagination, Row } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { laptopApi, catalogApi } from '../api/laptopApi';
import LaptopFilter from '../components/laptop/LaptopFilter';
import LaptopGrid from '../components/laptop/LaptopGrid';

const PAGE_SIZE = 8;

export default function LaptopListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const activeFilters = useMemo(() => ({
    brandId: searchParams.get('brandId') || '',
    categoryId: searchParams.get('categoryId') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    ramMin: searchParams.get('ramMin') || '',
    q: searchParams.get('q') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page') || 1),
  }), [searchParams]);

  useEffect(() => {
    async function loadMeta() {
      const [brandsData, categoriesData] = await Promise.all([catalogApi.getBrands(), catalogApi.getCategories()]);
      setBrands(brandsData);
      setCategories(categoriesData);
    }
    loadMeta();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const page = Number(searchParams.get('page') || 1);

    async function loadLaptops() {
      setLoading(true);
      const params = {
        _page: page,
        _limit: PAGE_SIZE,
        _sort: 'createdAt',
        _order: 'desc',
      };

      if (activeFilters.q) params.q = activeFilters.q;
      if (activeFilters.brandId) params.brandId = Number(activeFilters.brandId);
      if (activeFilters.categoryId) params.categoryId = Number(activeFilters.categoryId);
      if (activeFilters.priceMin) params.price_gte = Number(activeFilters.priceMin);
      if (activeFilters.priceMax) params.price_lte = Number(activeFilters.priceMax);
      if (activeFilters.ramMin) params.ram_gte = Number(activeFilters.ramMin);

      if (activeFilters.sort === 'price_asc') {
        params._sort = 'salePrice';
        params._order = 'asc';
      }
      if (activeFilters.sort === 'price_desc') {
        params._sort = 'salePrice';
        params._order = 'desc';
      }
      if (activeFilters.sort === 'bestseller') {
        params._sort = 'sold';
        params._order = 'desc';
      }

      try {
        const result = await laptopApi.getAll(params, controller.signal);
        setLaptops(result.items);
        setTotal(result.total);
      } catch (err) {
        if (err?.name !== 'CanceledError') {
          setLaptops([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
      }
    }

    loadLaptops();
    return () => controller.abort();
  }, [searchParams, activeFilters.q, activeFilters.brandId, activeFilters.categoryId, activeFilters.priceMin, activeFilters.priceMax, activeFilters.ramMin, activeFilters.sort]);

  const handleFilterChange = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === 'all') next.delete(key);
      else next.set(key, String(value));
    });
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleReset = () => {
    const next = new URLSearchParams(searchParams);
    ['brandId', 'categoryId', 'priceMin', 'priceMax', 'ramMin', 'sort', 'q', 'page'].forEach((key) => next.delete(key));
    setSearchParams(next);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Laptop</h2>
        <div className="d-flex gap-2 align-items-center">
          <Form.Select value={activeFilters.sort} onChange={(e) => handleFilterChange({ sort: e.target.value })} style={{ width: 180 }}>
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="bestseller">Bán chạy</option>
          </Form.Select>
          <Button variant="outline-primary" className="d-lg-none" onClick={() => setShowFilter(true)}>Bộ lọc</Button>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={3} className="d-none d-lg-block">
          <LaptopFilter
            filters={activeFilters}
            brands={brands}
            categories={categories}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </Col>

        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="text-muted">Tổng {total} sản phẩm</div>
            <Form.Control
              type="text"
              placeholder="Tìm theo tên..."
              value={activeFilters.q}
              onChange={(e) => handleFilterChange({ q: e.target.value, page: 1 })}
              style={{ maxWidth: 260 }}
            />
          </div>

          <LaptopGrid laptops={laptops} loading={loading} />

          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First disabled={activeFilters.page <= 1} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: 1 })} />
              <Pagination.Prev disabled={activeFilters.page <= 1} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: activeFilters.page - 1 })} />
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Pagination.Item key={page} active={page === activeFilters.page} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page })}>
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={activeFilters.page >= totalPages} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: activeFilters.page + 1 })} />
              <Pagination.Last disabled={activeFilters.page >= totalPages} onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: totalPages })} />
            </Pagination>
          </div>
        </Col>
      </Row>

      <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Bộ lọc</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <LaptopFilter
            filters={activeFilters}
            brands={brands}
            categories={categories}
            onChange={handleFilterChange}
            onReset={handleReset}
            idPrefix="mobile-filter"
          />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
