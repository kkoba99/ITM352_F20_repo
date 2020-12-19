
    var clothing_array = [ 
        {
            "item":"Versace Heart Sweater",
            "price": 39.99,
            "image":"heart_1.jpg"
        },
      
        {
            "item":"Heart Patch Pants",
            "price": 19.99,
            "image":"heart_2.jpg"
        },
        
        {
            "item":"J'Adore Heart Sweater",
            "price": 39.99,
            "image":"heart_3.jpg"
        },
      
        {
            "item":"Adidas Heart Shoes",
            "price": 24.99,
            "image":"heart_4.jpg"
        },
      
        {
            "item":"Love Moschino Sweater",
            "price": 39.99,
            "image":"heart_5.jpg"
        },
      
        {
            "item":"Keith Haring Long Sleeve",
            "price": 19.99,
            "image":"heart_6.jpg"
        }
    ];

    var jewelry_array = [ 
        {
            "item":"Rose Gold Heart Necklace",
            "price": 39.99,
            "image":"jewelry_1.jpg"
        },
      
        {
            "item":"Gold Heart Studs",
            "price": 29.99,
            "image":"jewelry_2.jpg"
        },
        
        {
            "item":"Gold Heart Charm Earrings",
            "price": 9.99,
            "image":"jewelry_3.jpg"
        },
      
        {
            "item":"Diamond Heart Ring",
            "price": 39.99,
            "image":"jewelry_4.jpg"
        },
      
        {
            "item":"Tourmaline Heart Ring",
            "price": 39.99,
            "image":"jewelry_5.jpg"
        },
      
        {
            "item":"Pink Quartz Necklace",
            "price": 14.99,
            "image":"jewelry_6.jpg"
        }
    ];

    var homedecor_array = [
        {
            "item":"Red Heart Chair",
            "price": 39.99,
            "image":"homedecor_1.jpg"
        },
      
        {
            "item":"Pink Heart Neon Light",
            "price": 19.99,
            "image":"homedecor_2.jpg"
        },
        
        {
            "item":"Heart Shaped Pillow",
            "price": 9.99,
            "image":"homedecor_3.jpg"
        },
      
        {
            "item":"Porcelain Heart Bowls",
            "price": 14.99,
            "image":"homedecor_4.jpg"
        },
      
        {
            "item":"Wooden Heart Candles",
            "price": 9.99,
            "image":"homedecor_5.jpg"
        },
      
        {
            "item":"Heart Shaped Standing Cabinet",
            "price": 39.99,
            "image":"homedecor_6.jpg"
        }
    ];
    var the_products = {
        "Clothing": clothing_array,
        "Jewelry": jewelry_array,
        "HomeDecor": homedecor_array
    }

    if(typeof module != 'undefined') {
        module.exports.the_products = the_products;
      }
