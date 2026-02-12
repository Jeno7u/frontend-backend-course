export const findProductById = (id, goods) => {
    const productId = parseInt(id);
    return goods.find((p) => p.id === productId);
};

export const deleteById = (id, goods) => {
    const productId = parseInt(id);

    let index = goods.findIndex((product) => product.id === productId);
    if (index !== -1) {
        goods.splice(index, 1);
    }
};

export const updateById = (id, goods, updatedProduct) => {
    const productId = parseInt(id);

    for (let i = 0; i < goods.length; i++) {
        if (goods[i].id === productId) {
            goods[i] = updatedProduct;
            break;
        }
    }
};
