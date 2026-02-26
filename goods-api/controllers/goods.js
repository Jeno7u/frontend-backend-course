export const findProductById = (id, goods) => {
    return goods.find((p) => p.id === id);
};

export const deleteById = (id, goods) => {
    let index = goods.findIndex((product) => product.id === id);
    if (index !== -1) {
        goods.splice(index, 1);
    }
};

export const updateById = (id, goods, updatedProduct) => {
    for (let i = 0; i < goods.length; i++) {
        if (goods[i].id === id) {
            goods[i] = updatedProduct;
            break;
        }
    }
};
