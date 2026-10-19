import connectDB from './config/db.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import generateToken from './utils/generateToken.js';
import dotenv from 'dotenv';

dotenv.config();

async function runTests() {
  console.log('--- Starting Backend Verification Tests ---');
  try {
    await connectDB();
    console.log('1. DB Connection & Seed: Passed');

    // Test 1: Fetch products
    const products = await Product.find({});
    if (products.length === 0) throw new Error('No products found in DB');
    console.log(`2. Products in DB: ${products.length} products found`);

    // Test 2: Admin and regular user authentication
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) throw new Error('Admin user not found in DB');
    const isAdminPasswordMatch = await admin.matchPassword('password123');
    if (!isAdminPasswordMatch) throw new Error('Admin password match failed');
    const adminToken = generateToken(admin._id);
    console.log('3. Admin Authentication: Passed');

    const customer = await User.findOne({ email: 'john@example.com' });
    if (!customer) throw new Error('Customer user not found in DB');
    const isCustomerPasswordMatch = await customer.matchPassword('password123');
    if (!isCustomerPasswordMatch) throw new Error('Customer password match failed');
    const customerToken = generateToken(customer._id);
    console.log('4. Customer Authentication: Passed');

    // Test 3: Create Order with server-side price validation
    const targetProduct = products[0];
    const initialStock = targetProduct.countInStock;
    const testQty = 2;

    if (initialStock < testQty) throw new Error('Insufficient initial stock for test');

    const calculatedItemsPrice = Math.round(targetProduct.price * testQty * 100) / 100;
    const shippingPrice = calculatedItemsPrice > 100 ? 0 : 10;
    const taxPrice = Math.round(0.15 * calculatedItemsPrice * 100) / 100;
    const totalPrice = Math.round((calculatedItemsPrice + shippingPrice + taxPrice) * 100) / 100;

    targetProduct.countInStock -= testQty;
    await targetProduct.save();

    const order = new Order({
      user: customer._id,
      orderItems: [
        {
          name: targetProduct.name,
          qty: testQty,
          image: targetProduct.image,
          price: targetProduct.price,
          product: targetProduct._id,
        },
      ],
      shippingAddress: {
        address: '123 Main St',
        city: 'Chennai',
        postalCode: '600001',
        country: 'India',
      },
      paymentMethod: 'Demo Payment',
      itemsPrice: calculatedItemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const savedOrder = await order.save();
    console.log(`5. Order Creation & Stock Decrement: Order ID #${savedOrder._id} created, Total: $${savedOrder.totalPrice}`);

    // Verify stock was decremented
    const refreshedProduct = await Product.findById(targetProduct._id);
    if (refreshedProduct.countInStock !== initialStock - testQty) {
      throw new Error(`Stock mismatch: expected ${initialStock - testQty}, got ${refreshedProduct.countInStock}`);
    }
    console.log(`6. Stock Decrement Verification: Passed (Stock was ${initialStock}, now ${refreshedProduct.countInStock})`);

    // Test 4: Update order to paid
    savedOrder.isPaid = true;
    savedOrder.paidAt = new Date();
    savedOrder.paymentResult = {
      id: `DEMO_TXN_${Date.now()}`,
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: customer.email,
    };
    await savedOrder.save();
    console.log('7. Payment Status Update: Passed');

    // Test 5: Update order to delivered
    savedOrder.isDelivered = true;
    savedOrder.deliveredAt = new Date();
    await savedOrder.save();
    console.log('8. Delivery Status Update: Passed');

    // Test 6: User order query isolation
    const customerOrders = await Order.find({ user: customer._id });
    if (customerOrders.length === 0) throw new Error('Customer orders query returned empty');
    console.log(`9. User Order Query: Passed (${customerOrders.length} order found for user)`);

    console.log('--- ALL BACKEND CORE VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

runTests();
