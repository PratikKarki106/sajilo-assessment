import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { useCart } from '../../hooks/useCart';
import './CartPage.css';

const TAX_RATE = 0.13;
const money = (value) => `$${value.toFixed(2)}`;

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <section className="cart-page">
      <header className="cart-header">
        <div>
          <p className="user-list-kicker">E-Commerce Shop</p>
          <h1 className="user-list-title">Your cart</h1>
        </div>
        <Link className="back-link" to="/products">Continue shopping</Link>
      </header>
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Browse the catalog and add something you love."
          action={<Button as={Link} to="/products">Browse products</Button>}
        />
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.thumbnail} alt="" />
                <div className="cart-item-info">
                  <Link to={`/products/${item.id}`}>{item.title}</Link>
                  <strong>{money(item.price)}</strong>
                  <label>
                    Quantity
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, event.target.value)}
                    />
                  </label>
                </div>
                <div className="cart-item-total">
                  <strong>{money(item.price * item.quantity)}</strong>
                  <Button variant="ghost" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title} from cart`}>Remove</Button>
                </div>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div><span>Tax (13%)</span><strong>{money(tax)}</strong></div>
            <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
            <Button onClick={() => window.alert('Checkout is not connected in this demo.')}>Checkout</Button>
          </aside>
        </div>
      )}
    </section>
  );
}
