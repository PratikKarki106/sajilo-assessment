import { Link, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import ProductCard from './components/ProductCard';
import './ProductsPage.css';

const PAGE_SIZE = 12;
const sortOptions = [
  { value: '', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'rating', label: 'Rating' },
];

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const { products, loading, error, retry } = useProducts();
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const debouncedQuery = useDebounce(query);
  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const result = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.title} ${product.description} ${product.brand || ''}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesQuery && (!category || product.category === category);
    });
    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, debouncedQuery, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const updateParams = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setParams(next);
  };

  return (
    <section className="products-page">
      <header className="products-header">
        <div>
          <p className="user-list-kicker">E-Commerce Shop</p>
          <h1 className="user-list-title">Products</h1>
        </div>
        <p className="user-list-count" aria-live="polite">
          {loading ? 'Updating catalog' : `${filteredProducts.length} products`}
        </p>
      </header>

      <div className="product-filters" aria-label="Product search and filters">
        <SearchInput
          id="product-search"
          label="Search products"
          value={query}
          onChange={(value) => updateParams({ q: value, page: '' })}
          placeholder="Search by product, brand, or description"
        />
        <Select
          id="product-category"
          label="Category"
          value={category}
          onChange={(value) => updateParams({ category: value, page: '' })}
          options={[{ value: '', label: 'All categories' }, ...categories.map((value) => ({ value, label: value }))]}
        />
        <Select
          id="product-sort"
          label="Sort by"
          value={sort}
          onChange={(value) => updateParams({ sort: value, page: '' })}
          options={sortOptions}
        />
        <Button
          variant="secondary"
          onClick={() => setParams({})}
          disabled={!query && !category && !sort}
        >
          Clear
        </Button>
      </div>

      {loading ? <LoadingState label="Loading products" /> : null}
      {!loading && error ? <ErrorState title="Could not load products" message={error} onRetry={retry} /> : null}
      {!loading && !error && visibleProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Try a different search term or clear your filters."
          action={<Button variant="secondary" onClick={() => setParams({})}>Clear search and filters</Button>}
        />
      ) : null}
      {!loading && !error && visibleProducts.length > 0 ? (
        <>
          <div className="product-grid">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} onPageChange={(value) => updateParams({ page: value })} />
        </>
      ) : null}
      <Link className="products-cart-link" to="/cart">View cart</Link>
    </section>
  );
}
