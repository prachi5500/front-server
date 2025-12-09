// import mongoose from 'mongoose';

// const cartItemSchema = new mongoose.Schema({
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true,
//     index: true
//   },
//   items: [{
//     id: {
//       type: String,
//       required: true
//     },
//     kind: { 
//       type: String, 
//       enum: ['classic', 'server'],
//       required: true
//     },
//     data: { 
//       type: mongoose.Schema.Types.Mixed,
//       required: true
//     },
//     selectedFont: {
//       type: String,
//       default: 'Arial, sans-serif'
//     },
//     fontSize: {
//       type: Number,
//       default: 16
//     },
//     textColor: {
//       type: String,
//       default: '#000000'
//     },
//     accentColor: {
//       type: String,
//       default: '#0ea5e9'
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0
//     },
//     serverMeta: {
//       name: String,
//       background_url: String,
//       back_background_url: String,
//       config: mongoose.Schema.Types.Mixed,
//       qrColor: String,
//       qrLogoUrl: String
//     },
//     saveAsTemplate: {
//       type: Boolean,
//       default: false
//     },
//     templateName: String,
//     frontData: mongoose.Schema.Types.Mixed,
//     backData: mongoose.Schema.Types.Mixed,
//     frontImageUrl: String,
//     backImageUrl: String,
//     thumbnailUrl: String,
//     createdAt: {
//       type: Date,
//       default: Date.now
//     },
//     updatedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, { 
//   timestamps: true,
//   toJSON: { 
//     virtuals: true,
//     transform: function(doc, ret) {
//       delete ret._id;
//       delete ret.__v;
//       return ret;
//     }
//   }
// });

// // Index for faster queries
// cartItemSchema.index({ userId: 1, 'items.id': 1 }, { unique: true });

// // Pre-save hook to update timestamps
// cartItemSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// export default mongoose.models.Cart || mongoose.model('Cart', cartItemSchema);

// models/Cart.js mein yeh ensure karein

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  kind: {
    type: String,
    enum: ['classic', 'server'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  selectedFont: {
    type: String,
    default: 'Arial, sans-serif'
  },
  fontSize: {
    type: Number,
    default: 16
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  accentColor: {
    type: String,
    default: '#0ea5e9'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  serverMeta: {
    name: String,
    background_url: String,
    back_background_url: String,
    config: mongoose.Schema.Types.Mixed,
    qrColor: String,
    qrLogoUrl: String
  },
  design: {
    positions: {
      name: { x: Number, y: Number },
      title: { x: Number, y: Number },
      company: { x: Number, y: Number },
      logo: { x: Number, y: Number }
    },
    sizes: {
      name: Number,
      title: Number,
      company: Number,
      logo: Number
    },
    positionsBack: {
      email: { x: Number, y: Number },
      phone: { x: Number, y: Number },
      website: { x: Number, y: Number },
      address: { x: Number, y: Number },
      qr: { x: Number, y: Number }
    },
    backSizes: {
      email: Number,
      phone: Number,
      website: Number,
      address: Number,
      qr: Number
    },
    font: String,
    fontSize: Number,
    textColor: String,
    accentColor: String,
    isEditLayout: Boolean,
    qrColor: String,
    qrLogoUrl: String,
    qrData: String
  },
  frontImageUrl: String,
  backImageUrl: String,
  thumbnailUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Update timestamps for items when cart is saved
cartSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.items.forEach(item => {
      if (!item.createdAt) item.createdAt = new Date();
      item.updatedAt = new Date();
    });
  }
  next();
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);