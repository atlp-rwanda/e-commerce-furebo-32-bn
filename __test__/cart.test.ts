import { Request, Response } from "express";
import sinon from "sinon";
import { addItemToCart, viewCart, updateCartItem, clearCart} from "../src/controllers/cart.controller";
import { CartService } from "../src/services/cart.service";
import { ProductService } from "../src/services/Product.services";
import { DataTypes, Sequelize } from "sequelize";
import User from "../src/database/models/user.model";
import Product from '../src/database/models/Product.model';
import Cart from "../src/database/models/cart.model";




describe("Cart Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let addCartItemStub: sinon.SinonStub;
  let getProductByIdStub: sinon.SinonStub;
  let getCartByUserIdStub: sinon.SinonStub;
  let updateCartItemStub: sinon.SinonStub;
  let clearCartStub: sinon.SinonStub;

  beforeEach(() => {
    req = { user: { id: "user123" } } as Partial<Request>;
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    } as any;
    statusStub = res.status as sinon.SinonStub;
    jsonStub = res.json as sinon.SinonStub;
    addCartItemStub = sinon.stub(CartService, "addItemToCart");
    getProductByIdStub = sinon.stub(ProductService, "getProductByid");
    getCartByUserIdStub = sinon.stub(CartService, "getCartByUserId");
    updateCartItemStub = sinon.stub(CartService, "updateCartItem");
    clearCartStub = sinon.stub(CartService, "clearCart");
  });

  afterEach(() => {
    sinon.restore();
  });
  describe("Add Item to cart", () => {
    it("should add an item to the cart", async () => {
      const cartItem = {
        userId: "user123",
        productId: "123",
        quantity: 2,
        name: "",
        description: ""
      };
      req.body = { productId: "123", quantity: 2 };
      req.user = { id: "user123" };
    
      getProductByIdStub.resolves({ id: "123", price: 10 });
    
      await addItemToCart(req as Request, res as Response);
    
      sinon.assert.calledOnceWithExactly(addCartItemStub, cartItem);
      sinon.assert.calledOnce(statusStub);
      sinon.assert.calledOnce(jsonStub);
    });
    

  it("should return 403 if user is unauthorized", async () => {
    req.user = undefined;
    req.body = { productId: "123", quantity: 2 };

    await addItemToCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(statusStub, 403);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Unauthorized" });
  });

  it("should return 404 if product is not found", async () => {
    req.user = { id: "user123" };
    req.body = { productId: "123", quantity: 2 };
    getProductByIdStub.resolves(null);

    await addItemToCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(getProductByIdStub, "123");
    sinon.assert.calledOnceWithExactly(statusStub, 404);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Product not found" });
  });


  it("should return 500 if there is an unexpected error", async () => {
    req.user = { id: "user123" };
    req.body = { productId: "123", quantity: 2 };
    getProductByIdStub.throws(new Error("Database error"));

    await addItemToCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(statusStub, 500);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Database error" });
  });
});
describe("view the cat cart", () => {
  it("should view the cart", async () => {
    const userId = "user123";
    req.user = { id: userId };
    const cart = [
      { quantity: 2, Product: { price: 10 } },
      { quantity: 3, Product: { price: 20 } }
    ];
    getCartByUserIdStub.resolves(cart);

    await viewCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(getCartByUserIdStub, userId);
    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWithExactly(jsonStub, { cart, cartTotal: 80 });
  });

  it("should return 403 if user is unauthorized", async () => {
    req.user = undefined;

    await viewCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(statusStub, 403);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Unauthorized" });
  });

  it("should return an empty cart if no items are found", async () => {
    req.user = { id: "user123" };
    getCartByUserIdStub.resolves([]);

    await viewCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(getCartByUserIdStub, "user123");
    sinon.assert.calledOnceWithExactly(statusStub, 200);
    sinon.assert.calledOnceWithExactly(jsonStub, { cart: [], cartTotal: 0 });
  });

  it("should return the cart and total if items are found", async () => {
    req.user = { id: "user123" };
    const cartItems = [
      { quantity: 2, Product: { price: 10 } },
      { quantity: 1, Product: { price: 20 } }
    ];
    getCartByUserIdStub.resolves(cartItems);

    await viewCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(getCartByUserIdStub, "user123");
    sinon.assert.calledOnceWithExactly(statusStub, 200);
    sinon.assert.calledOnceWithExactly(jsonStub, { cart: cartItems, cartTotal: 40 });
  });

  it("should return 500 if there is an unexpected error", async () => {
    req.user = { id: "user123" };
    getCartByUserIdStub.throws(new Error("Database error"));

    await viewCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(statusStub, 500);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Database error" });
  });
});
describe("Update the cat cart", () => {
  it("should update an item in the cart", async () => {
    const cartItem = { id: "456", userId: "user123", quantity: 3 };
    req.body = cartItem;

    await updateCartItem(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(updateCartItemStub, cartItem);
    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledOnce(jsonStub);
  });

  it("should return 403 if user is unauthorized", async () => {
    req.user = undefined;

    await updateCartItem(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(statusStub, 403);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Unauthorized" });
  });

  it("should update a cart item successfully", async () => {
    const cartItem = { id: "456", userId: "user123", quantity: 3 };
    req.user = { id: "user123" };
    req.body = { id: "456", quantity: 3 };
    updateCartItemStub.resolves(cartItem);

    await updateCartItem(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(updateCartItemStub, { id: "456", userId: "user123", quantity: 3 });
    sinon.assert.calledOnceWithExactly(statusStub, 200);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Cart item updated", cartItem });
  });

  it("should return 404 if cart item does not exist", async () => {
    req.user = { id: "user123" };
    req.body = { id: "456", quantity: 3 };
    updateCartItemStub.throws(new Error("Cart item not found"));

    await updateCartItem(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(updateCartItemStub, { id: "456", userId: "user123", quantity: 3 });
    sinon.assert.calledOnceWithExactly(statusStub, 500);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Cart item not found" });
  });

  it("should return 500 if there is an unexpected error", async () => {
    req.user = { id: "user123" };
    req.body = { id: "456", quantity: 3 };
    updateCartItemStub.throws(new Error("Database error"));

    await updateCartItem(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(updateCartItemStub, { id: "456", userId: "user123", quantity: 3 });
    sinon.assert.calledOnceWithExactly(statusStub, 500);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Database error" });
  });
});

describe("Clear the cat cart", () => {
  it("should clear the cart", async () => {
    const userId = "user123";
    req.user = { id: userId };

    await clearCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(clearCartStub, userId);
    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledOnce(jsonStub);
  });

  it("should return 403 if user is unauthorized", async () => {
    req.user = undefined;

    await clearCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(statusStub, 403);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Unauthorized" });
  });

  it("should clear the cart successfully", async () => {
    req.user = { id: "user123" };

    await clearCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(clearCartStub, "user123");
    sinon.assert.calledOnceWithExactly(statusStub, 200);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Cart cleared" });
  });

  it("should return 500 if there is an unexpected error", async () => {
    req.user = { id: "user123" };
    clearCartStub.throws(new Error("Database error"));

    await clearCart(req as Request, res as Response);

    sinon.assert.calledOnceWithExactly(clearCartStub, "user123");
    sinon.assert.calledOnceWithExactly(statusStub, 500);
    sinon.assert.calledOnceWithExactly(jsonStub, { message: "Database error" });
  });
});

});



describe("Cart Model", () => {
    const sequelize = new Sequelize('sqlite::memory:', { logging: false });
  
    beforeAll(async () => {
      // Initialize models
      User.init({
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        // Other user attributes
      }, { sequelize, modelName: "User" });
  
      Product.init({
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        // Other product attributes
      }, { sequelize, modelName: "Product" });
  
      Cart.init({
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
          },
        },
      }, { sequelize, modelName: "Cart", tableName: "Carts" });
  
      // Set up associations
      Cart.associate();
      await sequelize.sync();
    });
  
    afterAll(async () => {
      await sequelize.close();
    });
  
    it("should create a Cart with valid attributes", async () => {
      const user = await User.create({ id: "user-uuid" });
      const product = await Product.create({ id: "product-uuid" });
  
      const cartItem = await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2,
      });
  
      expect(cartItem.id).toBeDefined();
      expect(cartItem.userId).toBe(user.id);
      expect(cartItem.productId).toBe(product.id);
      expect(cartItem.quantity).toBe(2);
    });
  
    it("should validate quantity to be at least 1", async () => {
      try {
        await Cart.create({
          userId: "user-uuid",
          productId: "product-uuid",
          quantity: 0,
        });
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.name).toBe("SequelizeValidationError");
      }
    });
  
    it("should have associations defined", async () => {
      expect(Cart.associations.User).toBeDefined();
      expect(Cart.associations.Product).toBeDefined();
    });
  
    
  it("should correctly associate with User and Product models", async () => {
    const user = await User.create({ id: "user-uuid-2" });
    const product = await Product.create({ id: "product-uuid-2" });

    const cartItem = await Cart.create({
      userId: user.id,
      productId: product.id,
      quantity: 3,
    });

    const fetchedCartItem = await Cart.findByPk(cartItem.id, { include: [User, Product] });

    expect(fetchedCartItem).not.toBeNull();
    if (fetchedCartItem) {
      const associatedUser = await fetchedCartItem.getUser();
      const associatedProduct = await fetchedCartItem.getProduct();

      expect(associatedUser.id).toBe(user.id);
      expect(associatedProduct.id).toBe(product.id);
    }
  });
  });


  describe('CartService', () => {
    let findOneStub: sinon.SinonStub;
    let createStub: sinon.SinonStub;
    let findAllStub: sinon.SinonStub;
   
    let destroyStub: sinon.SinonStub;
  
    beforeEach(() => {
      findOneStub = sinon.stub(Cart, 'findOne');
      createStub = sinon.stub(Cart, 'create');
      findAllStub = sinon.stub(Cart, 'findAll');
     
      destroyStub = sinon.stub(Cart, 'destroy');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    describe('addItemToCart', () => {
      it('should add a new item to the cart if it does not exist', async () => {
        const cartItem = { userId: 'user123', productId: 'product123', quantity: 2, name: 'Sample Product', description: 'Sample Description' };
        const createCartItem = { userId: 'user123', productId: 'product123', quantity: 2 };
    
        findOneStub.resolves(null);
        createStub.resolves(createCartItem);
    
        const newItem = await CartService.addItemToCart(cartItem);
    
        sinon.assert.calledOnceWithExactly(createStub, createCartItem);
        expect(newItem).toEqual(createCartItem);
    });
    
    
      it('should throw an error if unable to add item to cart', async () => {
        const cartItem = { userId: 'user123', productId: 'product123', quantity: 2, name: 'Sample Product', description: 'Sample Description' };
        findOneStub.rejects(new Error('Unable to add item'));
    
        await expect(CartService.addItemToCart(cartItem)).rejects.toThrowError('Failed to add item to cart: Unable to add item');
      });
    });
  
    describe('getCartByUserId', () => {
      it('should return cart items for a given user ID', async () => {
        const userId = 'user123';
        const cartItems = [{ id: '1', userId, productId: 'product123', quantity: 2 }];
        findAllStub.resolves(cartItems);
  
        const result = await CartService.getCartByUserId(userId);
  
        sinon.assert.calledOnceWithExactly(findAllStub, { where: { userId }, include: [{ model: Product, attributes: ['productName', 'price', 'images'] }] });
        expect(result).toEqual(cartItems);
      });
    });
  
    describe('updateCartItem', () => {
      
  
      it('should throw an error if cart item not found', async () => {
        const cartItem = { id: 'cartItemId', userId: 'user123', quantity: 3 };
        findOneStub.resolves(null);
  
        await expect(CartService.updateCartItem(cartItem)).rejects.toThrowError('Cart item not found');
      });
    });
  
    describe('clearCart', () => {
      it('should clear the cart for a given user ID', async () => {
        const userId = 'user123';
        destroyStub.resolves(1);
  
        await CartService.clearCart(userId);
  
        sinon.assert.calledOnceWithExactly(destroyStub, { where: { userId } });
      });
    });
  
    describe('viewCart', () => {
      it('should return cart items for a given user ID', async () => {
        const userId = 'user123';
        const cartItems = [{ id: '1', userId, productId: 'product123', quantity: 2 }];
        findAllStub.resolves(cartItems);
  
        const result = await CartService.viewCart(userId);
  
        sinon.assert.calledOnceWithExactly(findAllStub, { where: { userId }, include: [{ model: Product, attributes: ['productName', 'price', 'images'] }] });
        expect(result).toEqual(cartItems);
      });
    });
  });
