import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useProduct } from '../../hooks/useProduct';
import { useCart } from '../../hooks/useCart';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';
import './ProductDetailPage.css';

const money = (value) => `$${Number(value).toFixed(2)}`;

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error, retry } = useProduct(id);
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (loading) return <LoadingState label="Loading product details" />;
  if (error || !product) {
    return <section className="product-detail-page"><Link className="back-link" to="/products">← Back to products</Link><ErrorState title="Could not load product" message={error || 'Product not found.'} onRetry={retry} /></section>;
  }

  function handleAdd() {
    addToCart(product);
    setAdded(true);
  }

  return (
    <article className="product-detail-page">
      <Link className="back-link" to="/products">← Back to products</Link>
      <div className="product-detail-main">
        <div className="product-gallery">
          <div className="product-gallery-feature">
            <img src={product.images[selectedImage] || product.thumbnail} alt={product.title} />
          </div>
          <div className="product-gallery-thumbs" aria-label="Product images">
            {product.images.map((image, index) => (
              <button key={image} type="button" className={index === selectedImage ? 'is-selected' : ''} onClick={() => setSelectedImage(index)} aria-label={`View image ${index + 1}`}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="product-detail-copy">
          <p className="product-card-category">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="product-detail-rating">★ {product.rating.toFixed(1)} · {product.stock} in stock</p>
          <p className="product-detail-price">{money(product.price)} <span>{product.discountPercentage.toFixed(0)}% off</span></p>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-meta"><strong>Brand:</strong> {product.brand || 'Unbranded'}</p>
          <p className="product-detail-meta"><strong>Shipping:</strong> {product.shippingInformation}</p>
          <Button onClick={handleAdd} disabled={product.stock === 0}>{added ? 'Added to cart' : 'Add to cart'}</Button>
        </div>
      </div>
      <section className="product-reviews">
        <h2>Customer reviews</h2>
        {product.reviews?.length ? product.reviews.map((review) => (
          <div className="product-review" key={`${review.reviewerEmail}-${review.date}`}>
            <Avatar src="" alt="" size={36} />
            <div><strong>{review.reviewerName}</strong><p>★ {review.rating} · {review.comment}</p></div>
          </div>
        )) : <p>No reviews yet.</p>}
      </section>
    </article>
  );
}
