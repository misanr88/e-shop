const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
// const cloudinary = require('cloudinary');
const fs = require("fs");
const { upload } = require("../multer");
// const {
//   default: Events,
// } = require("../../frontend/src/components/Events/Events");

// create event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => `${file.filename}`);

        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        const event = await Event.create(eventData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// // create event
// router.post(
//   '/create-event',
//   upload.array('images'),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const shopId = req.body.shopId;
//       const shop = await Shop.findById(shopId);
//       if (!shop) {
//         return next(new ErrorHandler('Shop Id is invalid!', 400));
//       } else {
//         let images = [];

//         if (typeof req.body.images === 'string') {
//           images.push(req.body.images);
//         } else {
//           images = req.body.images;
//         }

//         const imagesLinks = [];

//         for (let i = 0; i < images.length; i++) {
//           const result = await cloudinary.v2.uploader.upload(images[i], {
//             folder: 'products',
//           });

//           imagesLinks.push({
//             public_id: result.public_id,
//             url: result.secure_url,
//           });
//         }

//         const productData = req.body;
//         productData.images = imagesLinks;
//         productData.shop = shop;

//         const event = await Event.create(productData);

//         res.status(201).json({
//           success: true,
//           event,
//         });
//       }
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// get all events
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
// router.get(
//   "/get-all-events/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const events = await Event.find({ shopId: req.params.id });

//       res.status(201).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );

// delete product of a shop
// router.delete(
//   "/delete-shop-event/:id",

//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const productId = req.params.id;
//       const event = await Event.findByIdAndDelete(productId);
//       // const product = await Product.findById(req.params.id);

//       if (!event) {
//         return next(new ErrorHandler("Event is not found with this id", 500));
//       }

//       // for (let i = 0; 1 < product.images.length; i++) {
//       //   const result = await cloudinary.v2.uploader.destroy(
//       //     product.images[i].public_id
//       //   );
//       // }

//       // await product.remove();

//       res.status(201).json({
//         success: true,
//         message: "Event Deleted successfully!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );
// // delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const eventData = await Event.findById(productId);

      // for (let i = 0; 1 < product.images.length; i++) {
      //   const result = await cloudinary.v2.uploader.destroy(
      //     event.images[i].public_id
      //   );
      // }

      // await event.remove();

      // const filePath = event.images;
      // console.log(filePath);
      // fs.unlink(filePath, (err) => {
      //   if (err) {
      //     console.log(err);
      //     res.status(500).json({ message: "Error deleting file" });
      //   }
      // });

      // const product = await Product.findById(req.params.id);
      eventData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
      const event = await Event.findByIdAndDelete(productId);
      if (!event) {
        return next(new ErrorHandler("Event is not found with this id", 500));
      }

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// // all events --- for admin
// router.get(
//   '/admin-all-events',
//   isAuthenticated,
//   isAdmin('Admin'),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const events = await Event.find().sort({
//         createdAt: -1,
//       });
//       res.status(201).json({
//         success: true,
//         events,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

module.exports = router;
