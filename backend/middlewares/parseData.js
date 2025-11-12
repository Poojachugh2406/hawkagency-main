

// middleware/parseJsonFields.js
export const parseData = (req, res, next) => {
    try {
      // console.log(req.body)
      if (req.body.data && typeof req.body.data === 'string') {
        req.body.data = JSON.parse(req.body.data);
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format in form data',
      });
    }
    next();
  };
  
