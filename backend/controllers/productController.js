import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Create a new product
// @route   POST /api/product/new
// @access  Private/admin
export const createProduct = async (req, res) => {
  try {
    const {
      seller,
      name,
      brand,
      productCode,
      brandCode,
      productLink,
      ratingSlots,
      reviewSlots,
      onlyOrderSlots,
      reviewSubmittedSlots,
      productPlatform,
      isActive = true
    } = req.body;

    // Check required fields
    if (!seller || !name || !brand) {
      return res.status(400).json({
        success: false,
        message: 'Seller, name, and brand are required fields.'
      });
    }

    // Check if seller ID is valid
    if (!mongoose.Types.ObjectId.isValid(seller)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seller ID format.'
      });
    }

    // Check if product code already exists
    const isProductCodeExists = await Product.findOne({productCode: productCode});
    if(isProductCodeExists){
      return res.status(400).json({
        success: false,
        message: 'Product code already exists.'
      });
    }

    // Create new product
    const newProduct = new Product({
      seller,
      name: name.trim(),
      brand: brand.trim(),
      productCode: productCode?.trim(),
      brandCode: brandCode?.trim(),
      productLink: productLink?.trim(),
      ratingSlots: ratingSlots || 0,
      reviewSlots: reviewSlots || 0,
      onlyOrderSlots: onlyOrderSlots || 0,
      reviewSubmittedSlots: reviewSubmittedSlots || 0,
      productPlatform: productPlatform?.trim(),
      isActive
    });

    // Save product to database
    const savedProduct = await newProduct.save();
    
    // Populate seller details in response
    await savedProduct.populate('seller', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Product with similar details already exists'
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
};

// @desc    Get all products with seller details
// @route   GET /api/product/all-products
// @access  private/admin
// export const getAllProducts = async (req, res) => {
//   try {
    
//     const products = await Product.find()
//       .populate('seller', 'name email phone')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: 'Products retrieved successfully',
//       data: products
//     });

//   } catch (error) {
//     console.error('Error fetching products:', error);
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching products'
//     });
//   }
// };

// @desc    Get all products with seller details and booked slots
// @route   GET /api/product/all-products
// @access  private/admin
export const getAllProducts = async (req, res) => {
  try {
    
    const products = await Product.aggregate([
      // 1. Start with all products, and sort them like the original query
      {
        $sort: { createdAt: -1 }
      },

      // 2. Perform a "lookup" (join) to get the seller details
      // This mimics: .populate('seller', 'name email phone')
      {
        $lookup: {
          from: 'users', // The collection name for the 'User' model
          let: { sellerId: '$seller' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$sellerId'] }
              }
            },
            {
              $project: { // Only select the fields we need
                name: 1,
                email: 1,
                phone: 1
              }
            }
          ],
          as: 'sellerDetails' // Store the result in an array
        }
      },

      // 3. Unwind the sellerDetails array.
      // Since it's a 1-to-1 join, this turns the array [seller] into just seller
      {
        $unwind: {
          path: '$sellerDetails',
          preserveNullAndEmptyArrays: true // Keep products even if they have no seller
        }
      },

      // 4. Perform another "lookup" to get all NON-REJECTED orders
      // These are what we consider "booked slots"
      {
        $lookup: {
          from: 'orders', // The collection name for the 'Order' model
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productId'] },
                    { $ne: ['$orderStatus', 'rejected'] } // The crucial filter!
                  ]
                }
              }
            }
          ],
          as: 'bookedOrders' // Get an array of all booked orders
        }
      },

      // 5. Add new fields for the counts and format the output
      {
        $addFields: {
          // Re-assign 'seller' to be the object, just like populate did
          seller: '$sellerDetails',

          // Calculate the count for each 'ratingOrReview' type
          bookedRatingSlots: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'rating'] }
              }
            }
          },
          bookedReviewSlots: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'review'] }
              }
            }
          },
          bookedOnlyOrderSlots: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'only_order'] }
              }
            }
          },
          bookedReviewSubmitted: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'review_submitted'] }
              }
            }
          }
        }
      },

      // 6. Project the final shape to remove temporary fields
      {
        $project: {
          bookedOrders: 0,    // Remove the large temporary array of orders
          sellerDetails: 0  // Remove the temporary seller field
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};


// @desc    Get single product by ID
// @route   GET /api/product/:id
// @access  Private/admin
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    const product = await Product.findById(id)
      .populate('seller', 'name email phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/product/update-product/:id
// @access  Private/admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    // Create update object with only the fields that are present in req.body
    const updateFields = { ...req.body };
    
    // Trim string fields if they exist
    if (updateFields.name) updateFields.name = updateFields.name.trim();
    if (updateFields.brand) updateFields.brand = updateFields.brand.trim();
    if (updateFields.productCode) updateFields.productCode = updateFields.productCode.trim();
    if (updateFields.brandCode) updateFields.brandCode = updateFields.brandCode.trim();
    if (updateFields.productLink) updateFields.productLink = updateFields.productLink.trim();
    if (updateFields.productPlatform) updateFields.productPlatform = updateFields.productPlatform.trim();

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { $set: updateFields },
      {
        new: true, 
        runValidators: true,
      }
    ).populate('seller', 'name email phone');

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/product/delete/:id
// @access  Private/admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        _id: deletedProduct._id,
        name: deletedProduct.name
      }
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
};

// @desc    Toggle product active status
// @route   PATCH /api/product/:id/toggle-status
// @access  Private/admin
export const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    const updatedProduct = await product.save();
    await updatedProduct.populate('seller', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Product ${updatedProduct.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error toggling product status:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating product status'
    });
  }
};



// @desc    Get all products with seller details
// @route   GET /api/product/active-products
// @access  private/admin
// export const getActiveProducts = async (req, res) => {
//   try {
    
//     const products = await Product.find({isActive:true}).sort({ createdAt: -1 });
//     const allProducts = products.map(product=>({
//          _id:product._id ,
//          name:product.name , 
//          brand:product.brand , 
//          productCode:product.productCode , 
//          brandCode:product.brandCode ,
//          productLink:product.productLink,
//          productPlatform:product.productPlatform,
//          ratingSlots:product.ratingSlots,
//          reviewSlots:product.reviewSlots,
//         }));

//     res.status(200).json({
//       success: true,
//       message: 'Products retrieved successfully',
//       data: allProducts,
//     });

//   } catch (error) {
//     console.error('Error fetching products:', error);
    
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching products'
//     });
//   }
// };


// @desc    Get all active products (deals) with available slots
// @route   GET /api/product/active-deals
// @access  public
export const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      // 1. Filter for only 'isActive: true' products
      {
        $match: { isActive: true }
      },
      // 2. Sort by most recent
      {
        $sort: { createdAt: -1 }
      },

      // 3. Perform a "lookup" to get all NON-REJECTED orders
      // These are what we consider "booked slots"
      {
        $lookup: {
          from: 'orders', // The collection name for the 'Order' model
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productId'] },
                    { $ne: ['$orderStatus', 'rejected'] } // The crucial filter!
                  ]
                }
              }
            }
          ],
          as: 'bookedOrders' // Get an array of all booked orders
        }
      },

      // 4. Add new fields for total, booked, and available slots
      {
        $addFields: {
          // --- Calculate Booked Slots ---
          bookedRatingSlots: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'rating'] }
              }
            }
          },
          bookedReviewSlots: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'review'] }
              }
            }
          },
          bookedOnlyOrderSlots: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'only_order'] }
              }
            }
          },
          bookedReviewSubmitted: {
            $size: {
              $filter: {
                input: '$bookedOrders',
                as: 'order',
                cond: { $eq: ['$$order.ratingOrReview', 'review_submitted'] }
              }
            }
          },

          // --- Get Total Slots (and convert to Integer) ---
          totalRatingSlots: { $toInt: { $ifNull: ["$ratingSlots", 0] } },
          totalReviewSlots: { $toInt: { $ifNull: ["$reviewSlots", 0] } },
          totalOnlyOrderSlots: { $toInt: { $ifNull: ["$onlyOrderSlots", 0] } },
          totalReviewSubmitted: { $toInt: { $ifNull: ["$reviewSubmitted", 0] } },
        }
      },
      
      // 5. Calculate Available Slots
      {
        $addFields: {
          // Use $max to ensure available slots never go below 0
          availableRatingSlots: { 
            $max: [ 0, { $subtract: [ "$totalRatingSlots", "$bookedRatingSlots" ] } ]
          },
          availableReviewSlots: {
            $max: [ 0, { $subtract: [ "$totalReviewSlots", "$bookedReviewSlots" ] } ]
          },
          availableOnlyOrderSlots: {
            $max: [ 0, { $subtract: [ "$totalOnlyOrderSlots", "$bookedOnlyOrderSlots" ] } ]
          },
          availableReviewSubmitted: {
            $max: [ 0, { $subtract: [ "$totalReviewSubmitted", "$bookedReviewSubmitted" ] } ]
          }
        }
      },

      // 6. Project the final shape to remove unwanted fields
      {
        $project: {
          bookedOrders: 0,    // Remove the large temporary array
          seller: 0,          // Remove the seller ID
          __v: 0,             // Remove the version key
          
          // Remove the original string-based slot fields
          ratingSlots: 0,
          reviewSlots: 0,
          onlyOrderSlots: 0,
          reviewSubmitted: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Active deals retrieved successfully',
      data: products
    });

  } catch (error) {
    console.error('Error fetching active deals:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active deals'
    });
  }
};



// @desc    Get Available Slots for a Product
// @route   GET /api/product/slots/:id
// @access  public
export const getSlots = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format.'
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get all orders for this product that are in pending or accepted state
    const slotUsage = await Order.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(id),
          orderStatus: { $in: ['pending', 'accepted', 'payment_done'] }
        }
      },
      {
        $group: {
          _id: "$ratingOrReview",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert slot usage to a map for easy lookup
    const slotUsageMap = new Map();
    slotUsage.forEach(item => {
      slotUsageMap.set(item._id, item.count);
    });

    // Calculate available slots for each type
    const availableSlots = {
      rating: {
        totalSlots: product.ratingSlots || 0,
        usedSlots: slotUsageMap.get('rating') || 0,
        availableSlots: Math.max(0, (product.ratingSlots || 0) - (slotUsageMap.get('rating') || 0))
      },
      review: {
        totalSlots: product.reviewSlots || 0,
        usedSlots: slotUsageMap.get('review') || 0,
        availableSlots: Math.max(0, (product.reviewSlots || 0) - (slotUsageMap.get('review') || 0))
      },
      onlyOrder: {
        totalSlots: product.onlyOrderSlots || 0,
        usedSlots: slotUsageMap.get('only_order') || 0,
        availableSlots: Math.max(0, (product.onlyOrderSlots || 0) - (slotUsageMap.get('only_order') || 0))
      },
      reviewSubmitted: {
        totalSlots: product.reviewSubmitted || 0,
        usedSlots: slotUsageMap.get('review_submitted') || 0,
        availableSlots: Math.max(0, (product.reviewSubmitted || 0) - (slotUsageMap.get('review_submitted') || 0))
      }
    };

    // Calculate overall availability
    const totalAvailableSlots = 
      availableSlots.rating.availableSlots + 
      availableSlots.review.availableSlots + 
      availableSlots.onlyOrder.availableSlots + 
      availableSlots.reviewSubmitted.availableSlots;
    const isAvailable = totalAvailableSlots > 0;
    res.status(200).json({
      success: true,
      message: 'Available slots retrieved successfully',
      data: {
          totalAvailableSlots,
          isAvailable,
          slots:[
            { label:'Rating', 
              slots: availableSlots.rating.availableSlots||0,
              value :'rating'
            },
            { label:'Review', 
              slots: availableSlots.review.availableSlots||0,
              value :'review'
            },
            { label:'Only Order', 
              slots: availableSlots.onlyOrder.availableSlots||0,
              value :'only_order'
            },
            { label:'Review Submit', 
              slots: availableSlots.reviewSubmitted.availableSlots||0,
              value :'rview_submitted'
            }
          ]
      }
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available slots',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};