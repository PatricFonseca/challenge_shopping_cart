// const data = require("../src/data/products.json");
const { products } = require("../src/data/products");

const promotions = ["SINGLE LOOK", "DOUBLE LOOK", "TRIPLE LOOK", "FULL LOOK"];

function addCategoryOnList(categoryList, category) {
  // if (!categoryList.includes(category)) {
  categoryList.push(category);
  // }
}

function getShoppingCart(ids, productsList) {
  let categoryList = [];

  //Filtro os produtos que estão na lista
  let filteredList = productsList.filter((product) => {
    return ids.includes(product.id);
  });

  //Adiciona os categorias do produto em uma lista, para poder verificar depois as promoções
  filteredList.forEach((product) => {
    addCategoryOnList(categoryList, product.category);
  });

  //Limpo os duplicados
  categoryList = [...new Set(categoryList)];

  let total = calcValue(categoryList.length - 1, filteredList);

  let arrayReturn = {
    products: [],
    promotion: "",
    totalPrice: 0,
    discountValue: 0,
    // discountPercentage: 0,
    discount: 0,
  };

  filteredList.map((product) => {
    arrayReturn.products.push({
      name: product.name,
      category: product.category,
    });
  });

  arrayReturn.promotion = promotions[categoryList.length - 1];
  arrayReturn.totalPrice = total.totalPrice.toFixed(2);
  arrayReturn.discountValue = total.discountValue.toFixed(2);
  // arrayReturn.discountPercentage = `${total.discountPercentage.toFixed(2)}%`;
  arrayReturn.discount = `${total.discountPercentage.toFixed(2)}%`;

  return arrayReturn;
}

function calcValue(promotionIndex, products) {
  let totalPrice = 0;
  let totalWithDiscount = 0;
  let discountValue = 0;
  let discountPercentage = 0;
  let foundPromotion = false;

  products.map((product) => {
    foundPromotion = false;

    let promo = product.promotions.map((promotion) => {
      promotion.looks.map((look) => {
        if (look.indexOf(promotions[promotionIndex]) > -1) {
          totalWithDiscount += promotion.price;
          foundPromotion = true;
        }
      });
    });

    totalPrice += product.regularPrice;
    if (!foundPromotion) {
      totalWithDiscount += product.regularPrice;
    }

    console.log(totalPrice);
    console.log(totalWithDiscount);
  });

  discountValue = Number(totalPrice) - Number(totalWithDiscount);

  if (totalPrice === 0) {
    return {
      totalPrice: totalWithDiscount,
      discountValue: 0,
      discountPercentage: 0,
    };
  } else {
    return {
      totalPrice: totalWithDiscount,
      discountValue: discountValue,
      discountPercentage: (discountValue / totalPrice) * 100,
    };
  }
}

// console.log(getShoppingCart([120, 230, 310, 490], products));
// console.log(getShoppingCart([130, 140, 230, 260], products));

// console.log(getShoppingCart([490, 480, 260], products));
// console.log(getShoppingCart([490, 260], products));

module.exports = { getShoppingCart };
