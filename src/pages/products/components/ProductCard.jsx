import { Link } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import Button from '../../../components/ui/Button';
import './ProductCard.css';

const money = (value) => `$${Number(value).toFixed(2)}`;

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image-link" aria-label={`View ${product.title}`}>
        <img className="product-card-image" src={product.thumbnail} alt="" />
      </Link>
      <div className="product-card-content">
        <p className="product-card-category">{product.category}</p>
        <Link to={`/products/${product.id}`} className="product-card-title">{product.title}</Link>
        <div className="product-card-meta">
          <strong>{money(product.price)}</strong>
          <span>★ {product.rating.toFixed(1)}</span>
        </div>
        <p className="product-card-discount">{product.discountPercentage.toFixed(0)}% off</p>
        <Button onClick={() => addToCart(product)} aria-label={`Add ${product.title} to cart`}>Add to cart</Button>
      </div>
    </article>
  );
}
