import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import Order from './models/orderModel.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const TEST_PORT = 5002;

async function runEndToEndTests() {
  console.log('====================================================');
  console.log('    VERO MERN FULL-STACK END-TO-END WORKFLOW TEST   ');
  console.log('====================================================');

  await connectDB();

  const server = app.listen(TEST_PORT, () => {
    console.log(`Test Express server listening on port ${TEST_PORT}`);
  });

  const BASE_URL = `http://localhost:${TEST_PORT}/api`;

  try {
    // Helper function for fetch
    const request = async (url, options = {}) => {
      const res = await fetch(url, options);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      return { status: res.status, ok: res.ok, data };
    };

    // 1. Register a new user
    const testEmail = `shopper_${Date.now()}@example.com`;
    console.log(`\nStep 1: Registering new user (${testEmail})...`);
    const regRes = await request(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Shopper',
        email: testEmail,
        password: 'password123',
      }),
    });
    if (regRes.status !== 201) throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
    const customerToken = regRes.data.token;
    const customerId = regRes.data._id;
    console.log(`✓ User registered successfully! User ID: ${customerId}`);

    // 2. Log in with registered user
    console.log('\nStep 2: Authenticating registered user login...');
    const loginRes = await request(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' }),
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginRes.data)}`);
    console.log(`✓ Login verified! Token received: ${loginRes.data.token.substring(0, 20)}...`);

    // 3. Browse products
    console.log('\nStep 3: Browsing catalog products...');
    const prodRes = await request(`${BASE_URL}/products`);
    if (!prodRes.ok || !Array.isArray(prodRes.data) || prodRes.data.length === 0) {
      throw new Error('Failed to retrieve products');
    }
    console.log(`✓ Found ${prodRes.data.length} products in store catalog.`);
    const itemToBuy = prodRes.data[0];
    const initialStock = itemToBuy.countInStock;
    console.log(`  Target product: "${itemToBuy.name}" ($${itemToBuy.price}) | Stock: ${initialStock}`);

    // 4. Create an order with backend validation & stock decrement
    console.log('\nStep 4: Placing order (Testing server-side price validation & stock decrement)...');
    const orderQty = 1;
    const orderPayload = {
      orderItems: [
        {
          product: itemToBuy._id,
          name: itemToBuy.name,
          image: itemToBuy.image,
          price: 1.00, // Frontend tries to spoof price to $1.00 - Backend MUST override with DB price!
          qty: orderQty,
        },
      ],
      shippingAddress: {
        address: '42 MG Road',
        city: 'Bengaluru',
        postalCode: '560001',
        country: 'India',
      },
      paymentMethod: 'Demo Payment',
    };

    const placeOrderRes = await request(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (placeOrderRes.status !== 201) {
      throw new Error(`Order placement failed: ${JSON.stringify(placeOrderRes.data)}`);
    }

    const createdOrder = placeOrderRes.data;
    console.log(`✓ Order placed successfully! Order ID: #${createdOrder._id}`);

    // Verify backend calculated correct price and did NOT use the spoofed $1.00!
    if (createdOrder.orderItems[0].price !== itemToBuy.price) {
      throw new Error(`Price tampering vulnerability detected! Server accepted spoofed price.`);
    }
    console.log(`✓ Security verified: Server enforced trusted DB price ($${createdOrder.orderItems[0].price}) instead of spoofed price!`);

    // Verify stock decremented
    const refreshedProduct = await Product.findById(itemToBuy._id);
    if (refreshedProduct.countInStock !== initialStock - orderQty) {
      throw new Error(`Stock decrement failed! Expected ${initialStock - orderQty}, found ${refreshedProduct.countInStock}`);
    }
    console.log(`✓ Inventory verified: Stock decremented from ${initialStock} to ${refreshedProduct.countInStock}`);

    // 5. Customer views own order history
    console.log('\nStep 5: Fetching logged-in user order history (My Orders)...');
    const myOrdersRes = await request(`${BASE_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (!myOrdersRes.ok || myOrdersRes.data.length === 0) {
      throw new Error('Failed to retrieve user orders');
    }
    console.log(`✓ User order history loaded: ${myOrdersRes.data.length} order(s) found.`);

    // 6. View single order details
    console.log(`\nStep 6: Fetching Order Details for #${createdOrder._id}...`);
    const orderDetailsRes = await request(`${BASE_URL}/orders/${createdOrder._id}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (!orderDetailsRes.ok) throw new Error('Failed to fetch order details');
    console.log(`✓ Order details verified. Paid: ${orderDetailsRes.data.isPaid}, Delivered: ${orderDetailsRes.data.isDelivered}`);

    // 7. Complete simulated demo payment
    console.log('\nStep 7: Executing simulated demo payment...');
    const payRes = await request(`${BASE_URL}/orders/${createdOrder._id}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        id: `DEMO_TXN_${Date.now()}`,
        status: 'COMPLETED',
        email_address: testEmail,
      }),
    });
    if (!payRes.ok || !payRes.data.isPaid) {
      throw new Error('Payment simulation failed');
    }
    console.log(`✓ Payment successfully confirmed and verified in DB! PaidAt: ${payRes.data.paidAt}`);

    // 8. Admin login and permissions
    console.log('\nStep 8: Authenticating Admin account (admin@example.com)...');
    const adminLoginRes = await request(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'password123' }),
    });
    if (!adminLoginRes.ok || !adminLoginRes.data.isAdmin) {
      throw new Error('Admin authentication failed');
    }
    const adminToken = adminLoginRes.data.token;
    console.log(`✓ Admin session authenticated with role isAdmin: true`);

    // 9. Admin view all store orders
    console.log('\nStep 9: Admin inspecting all store orders...');
    const allOrdersRes = await request(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!allOrdersRes.ok) throw new Error('Admin failed to get all orders');
    console.log(`✓ Admin retrieved ${allOrdersRes.data.length} store orders.`);

    // 10. Admin mark order as delivered
    console.log(`\nStep 10: Admin marking Order #${createdOrder._id} as Delivered...`);
    const deliverRes = await request(`${BASE_URL}/orders/${createdOrder._id}/deliver`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!deliverRes.ok || !deliverRes.data.isDelivered) {
      throw new Error('Admin deliver order failed');
    }
    console.log(`✓ Order marked as Delivered in DB! DeliveredAt: ${deliverRes.data.deliveredAt}`);

    // 11. Admin Product CRUD
    console.log('\nStep 11: Admin Product CRUD operations...');
    // Create
    const newProdRes = await request(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Noise Cancelling Headphones Pro',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
        brand: 'Bose',
        category: 'Audio',
        countInStock: 15,
        description: 'Premium wireless acoustic isolation headphones',
      }),
    });
    if (newProdRes.status !== 201) throw new Error('Product creation failed');
    const createdProdId = newProdRes.data._id;
    console.log(`✓ Created new product: "${newProdRes.data.name}" (ID: ${createdProdId})`);

    // Update
    const updateProdRes = await request(`${BASE_URL}/products/${createdProdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ price: 179.99, countInStock: 20 }),
    });
    if (!updateProdRes.ok || updateProdRes.data.price !== 179.99) {
      throw new Error('Product update failed');
    }
    console.log(`✓ Updated product price to $${updateProdRes.data.price} and stock to ${updateProdRes.data.countInStock}`);

    // Delete
    const deleteProdRes = await request(`${BASE_URL}/products/${createdProdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!deleteProdRes.ok) throw new Error('Product delete failed');
    console.log(`✓ Product removed from inventory successfully`);

    // 12. Security & RBAC Boundary Verifications
    console.log('\nStep 12: Security & RBAC boundary verifications...');
    // Non-admin attempting to fetch all orders
    const unauthorizedOrdersRes = await request(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (unauthorizedOrdersRes.status !== 401 && unauthorizedOrdersRes.status !== 403) {
      throw new Error(`Security breach! Regular user was able to access all orders (Status: ${unauthorizedOrdersRes.status})`);
    }
    console.log(`✓ Security verified: Customer blocked from /api/orders (Status: ${unauthorizedOrdersRes.status})`);

    // Non-admin attempting to access users list
    const unauthorizedUsersRes = await request(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    if (unauthorizedUsersRes.status !== 401 && unauthorizedUsersRes.status !== 403) {
      throw new Error(`Security breach! Regular user was able to access user list (Status: ${unauthorizedUsersRes.status})`);
    }
    console.log(`✓ Security verified: Customer blocked from /api/users (Status: ${unauthorizedUsersRes.status})`);

    // Safety guard against deleting the last admin
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    const deleteAdminRes = await request(`${BASE_URL}/users/${adminUser._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (deleteAdminRes.status !== 400) {
      throw new Error(`Safety failure: Admin was able to delete their own or the last active admin account`);
    }
    console.log(`✓ Safety verified: Protection against deleting the last administrator active (${deleteAdminRes.data.message})`);

    console.log('\n====================================================');
    console.log('  ALL 15 END-TO-END WORKFLOW & SECURITY TESTS PASSED! ');
    console.log('====================================================\n');

    server.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ End-to-End Test Failed:', error.message);
    server.close();
    process.exit(1);
  }
}

runEndToEndTests();
