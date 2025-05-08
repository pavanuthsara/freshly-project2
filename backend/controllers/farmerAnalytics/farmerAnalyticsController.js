import Farmer from '../../models/userModel';
import Product from '../../models/productModel';
import Order from '../../models/order.model';

// Analyze revenue and cost for a farmer
const revenueAndCostAnalysis = async (req, res) => {
  try {
    const farmerId = req.user.id; // Assuming user ID is available from auth middleware
    const orders = await Order.find({ farmer: farmerId });
    
    let totalRevenue = 0;
    let totalCost = 0;

    for (const order of orders) {
      const product = await Product.findById(order.product);
      totalRevenue += order.quantity * order.price;
      totalCost += order.quantity * (product?.productionCost || 0);
    }

    const profit = totalRevenue - totalCost;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalCost,
        profit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating revenue and cost',
      error: error.message
    });
  }
};

// Calculate total sales for the current week
const totalSalesOfWeek = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const orders = await Order.find({
      farmer: farmerId,
      createdAt: { $gte: startOfWeek }
    });

    const totalSales = orders.reduce((sum, order) => sum + (order.quantity * order.price), 0);

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        orderCount: orders.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating weekly sales',
      error: error.message
    });
  }
};

// Calculate total sales by district
const totalSalesByDistrict = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const orders = await Order.find({ farmer: farmerId })
      .populate('customer'); // Assuming customer has district info

    const salesByDistrict = {};

    for (const order of orders) {
      const district = order.customer?.district || 'Unknown';
      const saleAmount = order.quantity * order.price;

      if (!salesByDistrict[district]) {
        salesByDistrict[district] = {
          totalSales: 0,
          orderCount: 0
        };
      }

      salesByDistrict[district].totalSales += saleAmount;
      salesByDistrict[district].orderCount += 1;
    }

    res.status(200).json({
      success: true,
      data: salesByDistrict
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating sales by district',
      error: error.message
    });
  }
};

// Analyze vegetable and fruit sales
const vegeAndFruitsAnalysis = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const orders = await Order.find({ farmer: farmerId })
      .populate('product');

    const analysis = {
      vegetables: { totalSales: 0, quantity: 0, orderCount: 0 },
      fruits: { totalSales: 0, quantity: 0, orderCount: 0 }
    };

    for (const order of orders) {
      const product = order.product;
      const category = product?.category?.toLowerCase().includes('vegetable') 
        ? 'vegetables' 
        : product?.category?.toLowerCase().includes('fruit') 
        ? 'fruits' 
        : null;

      if (category) {
        analysis[category].totalSales += order.quantity * order.price;
        analysis[category].quantity += order.quantity;
        analysis[category].orderCount += 1;
      }
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error analyzing vegetable and fruit sales',
      error: error.message
    });
  }
};

export {
  revenueAndCostAnalysis,
  totalSalesOfWeek,
  totalSalesByDistrict,
  vegeAndFruitsAnalysis
};