import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const round2 = (num) => Math.round(num * 100) / 100;

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items in cart' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Shipping address fields are required' });
    }

    // Verify products, check stock, and calculate trusted prices from database
    const dbOrderItems = [];
    let calculatedItemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name || item.product}` });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.countInStock}, requested: ${item.qty}`,
        });
      }

      // Decrement stock
      product.countInStock -= item.qty;
      await product.save();

      const itemTotal = round2(product.price * item.qty);
      calculatedItemsPrice = round2(calculatedItemsPrice + itemTotal);

      dbOrderItems.push({
        name: product.name,
        qty: item.qty,
        image: product.image,
        price: product.price, // Trusted price from DB
        product: product._id,
      });
    }

    // Backend-controlled price calculation
    const shippingPrice = calculatedItemsPrice > 100 ? 0 : 15;
    const taxPrice = round2(0.15 * calculatedItemsPrice);
    const totalPrice = round2(calculatedItemsPrice + shippingPrice + taxPrice);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country.trim(),
      },
      paymentMethod: paymentMethod || 'Demo Payment',
      itemsPrice: calculatedItemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Failed to place order' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization: only the order owner or an admin can access this order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch order' });
  }
};

// @desc    Update order to paid (Demo or Gateway)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || `DEMO_TXN_${Date.now()}`,
      status: req.body.status || 'COMPLETED',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || req.user.email,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: error.message || 'Failed to update payment status' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(500).json({ message: error.message || 'Failed to update delivery status' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch your orders' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch all orders' });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
