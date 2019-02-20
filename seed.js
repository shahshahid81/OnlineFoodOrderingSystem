const express = require('express');

const mongoose = require('mongoose');

const Food = require('./models/food');

const foodItems = [
    {
        Name : "Chaat Papdi",
        Description:"Fried Papdi mixed with onions, tomatos, mint, tamarind, and yogurt.",
        Price : 50.00,
        Category : "Appetizers",
        ImagePath : "/img/Food/CHAAT PAPDI.jpg"
    },
    {
        Name : "Chana Chaat",
        Description : "Chickpeas mixed with onions, tomatoes, mint, tamarind and yogurt.",
        Price : 40.00,
        Category : "Appetizers",
        ImagePath : "/img/Food/CHANA CHAAT.jpg"
    },
    {
        Name : "Vegetable Pakora",
        Description : "Mixed Vegetables dipped in chickpea batter and deep fried.",
        Price : 40.00,
        Category : "Appetizers",
        ImagePath : "/img/Food/VEGETABLE PAKORA.jpg"
    },
    {
        Name : "Vegetable Samosa",
        Description : "Flaky pastry filled with seasoned potatoes and peas (2 pieces).",
        Price : 40.00,
        Category : "Appetizers",
        ImagePath : "/img/Food/VEGETABLE SAMOSA.jpg"
    },
    {
        Name : "Paneer Pakora",
        Description : "Homemade cheese dipped in chickpea batter and fried.",
        Price : 60.00,
        Category : "Appetizers",
        ImagePath : "/img/Food/PANEER PAKORA.jpg"
    },
    {
        Name : "Chicken Pakora",
        Description : "Chicken dipped in chickpea batter and fried.",
        Price : 70.00,
        Category : "Appetizers",
        ImagePath : "/img/Food/CHICKEN PAKORA.jpg"
    },
    {
        Name : "Chicken Curry",
        Description : "Lightly spiced boneless chicken cooked in a mild sauce.",
        Price : 200.00,
        Category : "Chicken",
        ImagePath : "/img/Food/CHICKEN CURRY.jpg"
    },
    {
        Name : "Chicken Vindaloo",
        Description : "Boneless chicken sauteed in a hot and sour sauce with potatoes.",
        Price : 220.00,
        Category : "Chicken",
        ImagePath : "/img/Food/CHICKEN VINDALOO.jpg"
    },
    {
        Name : "Chicken Tikka Masala",
        Description : "Tandoori boneless chicken with tomatoes, onions, garlic, and bell peppers.",
        Price : 240.00,
        Category : "Chicken",
        ImagePath : "/img/Food/CHICKEN TIKKA MASALA.jpg"
    },
    {
        Name : "Chicken Green Masala",
        Description : "Boneless chicken with tomatoes and onions in hot spinach sauce.",
        Price : 220.00,
        Category : "Chicken",
        ImagePath : "/img/Food/CHICKEN GREEN MASALA.jpg"
    },
    {
        Name : "Chicken Palak",
        Description : "Boneless chicken with spinach and mild spices.",
        Price : 220.00,
        Category : "Chicken",
        ImagePath : "/img/Food/CHICKEN PALAK.jpg"
    },
    {
        Name : "Tandoori Chicken",
        Description : "Spring chicken marinated in yogurt and mild spices.",
        Price : 250.00,
        Category : "Chicken",
        ImagePath : "/img/Food/TANDOORI CHICKEN.jpg"
    },
    {
        Name : "Chicken Tikka",
        Description : "Boneless chicken marinated in yogurt and mild spices.",
        Price : 250.00,
        Category : "Chicken",
        ImagePath : "/img/Food/CHICKEN TIKKA.jpg"
    },
    {
        Name : "Chicken Malai Kabab",
        Description : "Boneless chicken breast marinated in yogurt and fresh cream and spices.",
        Price : 265.00,
        Category : "Chicken",
        ImagePath : "/img/Food/CHICKEN MALAI KABAB.jpg"
    },
    {
        Name : "Fish Curry",
        Description : "Seasonal white fish sauteed with onions in a curry sauce.",
        Price : 220.00,
        Category : "Seafood",
        ImagePath : "/img/Food/FISH CURRY.jpg"
    },
    {
        Name : "Fish Green Masala",
        Description : "Seasonal white fish, tomatoes, and onions in a hot spinach sauce.",
        Price : 240.00,
        Category : "Seafood",
        ImagePath : "/img/Food/FISH GREEN MASALA.jpg"
    },
    {
        Name : "Fish Masala",
        Description : "Fish cooked in fried onions, tomatoes, and garlic in medium spiced sauced.",
        Price : 240.00,
        Category : "Seafood",
        ImagePath : "/img/Food/FISH MASALA.jpg"
    },
    {
        Name : "Fish Vindaloo",
        Description : "Seasonal white fish cooked in a hot and sour sauce with potatoes.",
        Price : 230.00,
        Category : "Seafood",
        ImagePath : "/img/Food/FISH VINDALOO.jpg"
    },
    {
        Name : "Fish Malai",
        Description : "Seasonal white fish cooked in coconut milk and fresh cream.",
        Price : 280.00,
        Category : "Seafood",
        ImagePath : "/img/Food/FISH MALAI.jpg"
    },
    {
        Name : "Shrimp Curry",
        Description : "Jumbo shrimp sauteed with onions in a curry sauce.",
        Price : 260.00,
        Category : "Seafood",
        ImagePath : "/img/Food/SHRIMP CURRY.jpg"
    },
    {
        Name : "Shrimp Green Masala",
        Description : "Jumbo shrimp, tomatoes, and onions in a hot spinach sauce.",
        Price : 260.00,
        Category : "Seafood",
        ImagePath : "/img/Food/SHRIMP GREEN MASALA.jpg"
    },
    {
        Name : "Shrimp Malai",
        Description : "Jumbo shrimp sauteed in coconut milk and fresh cream.",
        Price : 260.00,
        Category : "Seafood",
        ImagePath : "/img/Food/SHRIMP MALAI.jpg"
    },
    {
        Name : "Shrimp Vindaloo",
        Description : "Jumbo shrimp cooked in a hot and sour sauce with potatoes.",
        Price : 260.00,
        Category : "Seafood",
        ImagePath : "/img/Food/SHRIMP VINDALOO.jpg"
    },
    {
        Name : "Basmati Rice",
        Description : "White Rice",
        Price : 35.00,
        Category : "Rice",
        ImagePath : "/img/Food/BASMATI RICE.jpg"
    },
    {
        Name : "Lemon Rice",
        Description : "Lemon flavored rice with mild spices.",
        Price : 50.00,
        Category : "Rice",
        ImagePath : "/img/Food/LEMON RICE.jpg"
    },
    {
        Name : "Tomato Rice",
        Description : "Rice cooked with tomato and spices.",
        Price : 50.00,
        Category : "Rice",
        ImagePath : "/img/Food/TOMATO RICE.jpg"
    },
    {
        Name : "Vegetable Biryani",
        Description : "Fresh Vegetables in a lightly spiced sauce, with herbs, baked with basmati rice.",
        Price : 200.00,
        Category : "Rice",
        ImagePath : "/img/Food/VEGETABLE BIRYANI.jpg"
    },
    {
        Name : "Chicken Biryani",
        Description : "Boneless chicken in a lightly spiced sauce, with herbs, baked with basmati rice.",
        Price : 250.00,
        Category : "Rice",
        ImagePath : "/img/Food/CHICKEN BIRYANI.jpg"
    },
    {
        Name : "Fish Biryani",
        Description : "Seasonal white fish sauteed in a lightly spiced sauce, with herbs, baked with basmati rice.",
        Price : 300.00,
        Category : "Rice",
        ImagePath : "/img/Food/FISH BIRYANI.jpg"
    },
    {
        Name : "Shrimp Biryani",
        Description : "Jumbo shrimp in a lightly spieced sauce, with herbs, baked with basmati rice.",
        Price : 300.00,
        Category : "Rice",
        ImagePath : "/img/Food/SHRIMP BIRYANI.jpg"
    },
    {
        Name : "Dal Tadka",
        Description : "Red lentil cooked with onions and tomatoes.",
        Price : 150.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/DAL TADKA.jpg"
    },
    {
        Name : "Dal Makhani",
        Description : "Lentils and beans cooked in creamy butter sauce.",
        Price : 150.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/DAL MAKHANI.jpg"
    },
    {
        Name : "Aloo Matar",
        Description : "Potatoes and peas in a mildly spicy sauce.",
        Price : 150.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/ALOO MATAR.jpg"
    },
    {
        Name : "Aloo Palak",
        Description : "Freshly chopped spinach and potatoes in a creamy sauce.",
        Price : 150.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/ALOO PALAK.jpg"
    },
    {
        Name : "Aloo Gobi",
        Description : "Specially spiced potatoes, cauliflower, onions and tomatoes.",
        Price : 150.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/ALOO GOBI.jpg"
    },
    {
        Name : "Palak Paneer",
        Description : "Fresh chopped spinach and homemade cheese.",
        Price : 180.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/PALAK PANEER.jpg"
    },
    {
        Name : "Matar Paneer",
        Description : "Distinctively spiced peas and homemade cheese.",
        Price : 180.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/MATAR PANEER.jpg"
    },
    {
        Name : "Paneer Makhani",
        Description : "Homemade cheese in a creamy butter and tomato sauce.",
        Price : 210.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/PANEER MAKHANI.jpg"
    },
    {
        Name : "Paneer Shahi Korma",
        Description : "Cubed cheese in a creamy garlic and onion sauce, cashews and raisins",
        Price : 210.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/PANEER SHAHI KORMA.jpg"
    },
    {
        Name : "Baigan Bharta",
        Description : "Freshly roasted eggplant with tomatoes, onions and green peas.",
        Price : 150.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/BAIGAN BHARTA.jpg"
    },
    {
        Name : "Bhindi Masala",
        Description : "Okra sauteed with onions and tomatoes.",
        Price : 150.00,
        Category : "Vegetable",
        ImagePath : "/img/Food/BHINDI MASALA.jpg"
    },
    {
        Name : "Naan",
        Description : "Traditional indian white bread.",
        Price : 20.00,
        Category : "Bread",
        ImagePath : "/img/Food/NAAN.jpg"
    },
    {
        Name : "Roti",
        Description : "Whole wheat bread.",
        Price : 15.00,
        Category : "Bread",
        ImagePath : "/img/Food/ROTI.jpg"
    },
    {
        Name : "Paratha",
        Description : "Whole wheat bread with butter.",
        Price : 20.00,
        Category : "Bread",
        ImagePath : "/img/Food/PARATHA.jpg"
    },
    {
        Name : "Garlic Naan",
        Description : "White bread baked with garlic and cilantro.",
        Price : 25.00,
        Category : "Bread",
        ImagePath : "/img/Food/GARLIC NAAN.jpg"
    },
    {
        Name : "Aloo Paratha",
        Description : "Whole wheat bread stuffed with seasoned potatoes and peas.",
        Price : 25.00,
        Category : "Bread",
        ImagePath : "/img/Food/ALOO PARATHA.jpg"
    },
    {
        Name : "Gobi Paratha",
        Description : "Whole wheat bread stuffed with cauliflower.",
        Price : 25.00,
        Category : "Bread",
        ImagePath : "/img/Food/GOBI PARATHA.jpg"
    },
    {
        Name : "Gulab Jamun",
        Description : "Deep fried milk confection in sweet syrup (3 pieces).",
        Price : 35.00,
        Category : "Dessert",
        ImagePath : "/img/Food/GULAB JAMUN.jpg"
    },
    {
        Name : "Kheer",
        Description : "Rice cooked in flavoured milk with nuts and cardamon, served cold.",
        Price : 45.00,
        Category : "Dessert",
        ImagePath : "/img/Food/KHEER.jpg"
    },
    {
        Name : "Kulfi",
        Description : "Homemade sweetened milk ice cream, choice of mango or pistachio.",
        Price : 45.00,
        Category : "Dessert",
        ImagePath : "/img/Food/KULFI.jpg"
    },
    {
        Name : "Gajar Halwa",
        Description : "Grated carrots cooked in milk and butter.",
        Price : 45.00,
        Category : "Dessert",
        ImagePath : "/img/Food/GAJAR HALWA.jpg"
    },
    {
        Name : "Lassi",
        Description : "Cold sweetened yogurt drink.",
        Price : 30.00,
        Category : "Beverage",
        ImagePath : "/img/Food/LASSI.jpg"
    },
    {
        Name : "Mango Juice",
        Description : "Juice made of fresh mango pulp.",
        Price : 30.00,
        Category : "Beverage",
        ImagePath : "/img/Food/MANGO JUICE.jpg"
    },
    {
        Name : "Chai",
        Description : "Chai Tea",
        Price : 20.00,
        Category : "Beverage",
        ImagePath : "/img/Food/CHAI.jpg"
    },
    {
        Name : "Cold Drink",
        Description : "Coke, Sprite, Fanta, Thums Up, Pepsi",
        Price : 50.00,
        Category : "Beverage",
        ImagePath : "/img/Food/COLD DRINK.jpg"
    }
];

function seedDB(){
Food.deleteMany({},function(err){
    if(err){
        console.log(err);
    } else {
        console.log('collection deleted successfully');
        Food.insertMany(foodItems,function(err){
            if(err){
                console.log(err);
            } else {
                console.log('Food Items inserted.');
            }
        });
        }
    });
}

module.exports = seedDB;