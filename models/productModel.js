const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },

  gram: {
    type: Number,
    required: [true, "Please enter the weight of the product"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },

  ratings: {
    type: String,
    default: 0,
  },
  images: [
    {
      image: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
    enum: {
      values: ["Gold", "Silver", "Diamond", "Gifts"],
      message: "Please select correct category",
    },
  },
  price: {
    type: Number,
    required: [true, "Please enter amount"],
  },
  rtprice: {
    type: Number,
   
  },
  type: {
    type: String,
    required: [true, "Please select the Type of Jewellery"],
    validate: {
      validator: function (value) {
        const typesByCategory = {
          Gold: [
            "Ring",
            "Earring",
            "Kadas",
            "Bracelet",
            "Bangle",
            "Chain",
            "Mangalyam",
            "Necklace",
            "Haram",
          ],
          Silver: ["Ring", "Earring", "Bracelet", "Chain", "Anklet"],
          Diamond: ["Ring", "Earring", "Nosepin", "Necklace"],
          Gifts: ["God statue", "Vizhaku", "Pen", "Pendant", "Mugappu"],
        };

        return typesByCategory[this.category].includes(value);
      },
      message: (props) =>
        `${props.value} is not a valid type for the selected category`,
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [20, "Product stock cannot exceed 20"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        // required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

let schema = mongoose.model("Product", productSchema);

module.exports = schema;
