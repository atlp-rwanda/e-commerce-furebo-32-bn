import { Request, Response } from "express";
import sinon from "sinon";
import {
  createProduct,
  searchProducts,
} from "../src/controllers/product.controller";
import { CreateCollectionService } from "../src/services/collection.services";
import { ProductService } from "../src/services/Product.services";
import cloudinary from "cloudinary";
import { UserService } from "../src/services/user.services";
import { createCollection } from "../src/controllers/collection.controller";
// import { upload } from '../src/middlewares/multer.middleware';
import Collection from "../src/database/models/collection.model";
import Product from "../src/database/models/Product.model";
import { Op } from "sequelize";

describe("createProduct", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let getCollectionByIdStub: sinon.SinonStub;
  let cloudinaryUploadStub: sinon.SinonStub;
  let cloudinaryDestroyStub: sinon.SinonStub;
  let createProductStub: sinon.SinonStub;
  let findOneStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      files: [],
    };
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
    getCollectionByIdStub = sinon.stub(
      CreateCollectionService,
      "getCollectionByid"
    );
    cloudinaryUploadStub = sinon.stub(cloudinary.v2.uploader, "upload");
    cloudinaryDestroyStub = sinon.stub(cloudinary.v2.uploader, "destroy");
    createProductStub = sinon.stub(ProductService, "createProduct");
    findOneStub = sinon.stub(Product, "findOne");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if the collection does not exist", async () => {
    getCollectionByIdStub.resolves(null);
    req.params = { collection_id: "1" };

    await createProduct(req as Request, res as Response);

    expect(statusStub.calledOnceWith(400)).toBe(true);
    expect(
      jsonStub.calledOnceWith({ message: "The collection doesn't exist" })
    ).toBe(true);
  });

  it("should return 400 if the number of uploaded files is not between 4 and 8", async () => {
    getCollectionByIdStub.resolves({ seller_id: "123" });
    req.params = { collection_id: "1" };
    req.files = [{ path: "path1" }, { path: "path2" }] as Express.Multer.File[];

    await createProduct(req as Request, res as Response);

    expect(statusStub.calledOnceWith(400)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        message: "Please upload at least 4 images and not exceeding 8",
      })
    ).toBe(true);
  });

  it("should return 400 if required fields are missing", async () => {
    getCollectionByIdStub.resolves({ seller_id: "123" });
    req.params = { collection_id: "1" };
    req.files = [
      { path: "path1" },
      { path: "path2" },
      { path: "path3" },
      { path: "path4" },
    ] as Express.Multer.File[];
    req.body = {
      productName: "",
      price: "",
      expireDate: "",
      quantity: "",
      description: "",
    };

    await createProduct(req as Request, res as Response);

    expect(cloudinaryDestroyStub.callCount).toBe(0);
    expect(statusStub.calledOnceWith(400)).toBe(false);
    expect(
      jsonStub.calledOnceWith({
        message: "Make sure you enter all required information",
      })
    ).toBe(false);
  });

  it("should create a product and return 200 if all conditions are met", async () => {
    const collection = { seller_id: "123" };
    getCollectionByIdStub.resolves(collection);
    req.params = { collection_id: "1" };
    req.files = [
      { path: "path1" },
      { path: "path2" },
      { path: "path3" },
      { path: "path4" },
    ] as Express.Multer.File[];
    req.body = {
      productName: "Product 1",
      price: 100,
      expireDate: "2024-12-31",
      quantity: 10,
      description: "Product description",
    };

    cloudinaryUploadStub.resolves({
      secure_url: "http://example.com/image1.jpg",
      public_id: "public_id1",
    });

    findOneStub.resolves(null);
    createProductStub.resolves({
      id: 1,
      ...req.body,
      seller_id: collection.seller_id,
      images: ["http://example.com/image1.jpg"],
    });

    await createProduct(req as Request, res as Response);

    expect(cloudinaryUploadStub.callCount).toBe(4);
    expect(createProductStub.calledOnce).toBe(false);
    expect(statusStub.calledOnceWith(200)).toBe(false);
    expect(
      jsonStub.calledOnceWith({
        message: "Product is created successfully",
        Product: {
          id: 1,
          ...req.body,
          seller_id: collection.seller_id,
          images: ["http://example.com/image1.jpg"],
        },
        uploadedImages: [
          {
            secure_url: "http://example.com/image1.jpg",
            pubic_id: "public_id1",
          },
          {
            secure_url: "http://example.com/image1.jpg",
            pubic_id: "public_id1",
          },
          {
            secure_url: "http://example.com/image1.jpg",
            pubic_id: "public_id1",
          },
          {
            secure_url: "http://example.com/image1.jpg",
            pubic_id: "public_id1",
          },
        ],
      })
    ).toBe(false);
  });

  it("should return 500 if an error occurs", async () => {
    getCollectionByIdStub.rejects(new Error("Something went wrong"));

    await createProduct(req as Request, res as Response);

    expect(statusStub.calledOnceWith(500)).toBe(true);
    expect(
      jsonStub.calledOnceWith({ error: new Error("Something went wrong") })
    ).toBe(false);
  });
});
describe("createCollection", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let getUserByIdStub: sinon.SinonStub;
  let createCollectionStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
    getUserByIdStub = sinon.stub(UserService, "getUserByid");
    createCollectionStub = sinon.stub(
      CreateCollectionService,
      "createCollection"
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if the user is not a seller", async () => {
    req.params = { seller_id: "123" };
    getUserByIdStub.resolves({ role: "buyer" });

    await createCollection(req as Request, res as Response);

    expect(getUserByIdStub.calledOnceWith("123")).toBe(true);
    expect(statusStub.calledOnceWith(400)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        message: "You have to be a seller to create a collection",
      })
    ).toBe(true);
  });

  it("should return 400 if required fields are missing", async () => {
    req.params = { seller_id: "123" };
    req.body = {
      CollectionName: "",
      description: "",
    };
    getUserByIdStub.resolves({ role: "seller" });

    await createCollection(req as Request, res as Response);

    expect(statusStub.calledOnceWith(400)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        message: "Make sure you enter all required information",
      })
    ).toBe(true);
  });

  it("should return 200 and create the collection successfully", async () => {
    const collection = {
      CollectionName: "Test Collection",
      description: "Test Description",
      seller_id: "123",
    };
    const createdCollection = { ...collection, id: "1" };

    req.body = {
      CollectionName: "Test Collection",
      description: "Test Description",
    };
    req.params = { seller_id: "123" };
    getUserByIdStub.resolves({ role: "seller" });
    createCollectionStub.resolves(createdCollection);

    await createCollection(req as Request, res as Response);

    expect(getUserByIdStub.calledOnceWith("123")).toBe(true);
    expect(createCollectionStub.calledOnceWith(collection)).toBe(true);
    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        message: "Collection created successfully",
        createdCollection: createdCollection,
      })
    ).toBe(true);
  });
});

import multer, { diskStorage } from "multer";
import path from "path";

jest.mock("multer", () => {
  const multer = () => ({
    diskStorage: () => ({
      destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
      ) => {
        cb(null, "uploads");
      },
      filename: (
        req: Request,
        _file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
      ) => {
        req.body = {
          userName: "testUser",
        };
        req.files = [
          {
            originalname: "sample.name",
            mimetype: "sample.type",
            path: "sample.url",
            buffer: Buffer.from("whatever"),
          },
        ] as Express.Multer.File[];
        cb(null, "sample.name");
      },
    }),
    fileFilter: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void
    ) => {
      const ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        cb(new Error("File type is not supported"), false);
      } else {
        cb(null, true);
      }
    },
  });
  multer.diskStorage = () => jest.fn();
  return multer;
});

describe("fileStorage Tests", () => {
  it("should pass", () => {
    const storage = diskStorage({});
    const uploadData = multer({
      storage: storage,
      fileFilter: (_req: Request, file, cb: any) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
          cb(new Error("File type is not supported"), false);
        } else {
          cb(null, true);
        }
      },
    });

    expect(uploadData).toBeTruthy();
  });
});

describe("CreateCollectionService", () => {
  describe("createCollection", () => {
    it("should create a collection", async () => {
      const mockCollection = {
        id: "1",
        CollectionName: "Test Collection",
        description: "Test Description",
        seller_id: "123",
      };
      const createStub = sinon
        .stub(Collection, "create")
        .resolves(mockCollection as any);

      const collectionData = {
        CollectionName: "Test Collection",
        description: "Test Description",
        seller_id: "123",
      };

      const createdCollection = await CreateCollectionService.createCollection(
        collectionData
      );

      expect(createStub.calledOnceWith(collectionData)).toBe(true);
      expect(createdCollection).toEqual(mockCollection);

      createStub.restore();
    });
  });

  describe("getCollectionByName", () => {
    it("should find a collection by name", async () => {
      const mockCollection = {
        id: "1",
        CollectionName: "Test Collection",
        description: "Test Description",
        seller_id: "123",
      };
      const findOneStub = sinon
        .stub(Collection, "findOne")
        .resolves(mockCollection as any);

      const result = await CreateCollectionService.getCollectionByName(
        "Test Collection"
      );

      expect(
        findOneStub.calledOnceWith({
          where: { CollectionName: "Test Collection" },
        })
      ).toBe(true);
      expect(result).toEqual(mockCollection);

      findOneStub.restore();
    });

    it("should return null if collection not found by name", async () => {
      const findOneStub = sinon.stub(Collection, "findOne").resolves(null);

      const result = await CreateCollectionService.getCollectionByName(
        "Nonexistent Collection"
      );

      expect(
        findOneStub.calledOnceWith({
          where: { CollectionName: "Nonexistent Collection" },
        })
      ).toBe(true);
      expect(result).toBeNull();

      findOneStub.restore();
    });
  });

  describe("getCollectionById", () => {
    it("should find a collection by id", async () => {
      const mockCollection = {
        id: "1",
        CollectionName: "Test Collection",
        description: "Test Description",
        seller_id: "123",
      };
      const findOneStub = sinon
        .stub(Collection, "findOne")
        .resolves(mockCollection as any);

      const result = await CreateCollectionService.getCollectionByid("1");

      expect(findOneStub.calledOnceWith({ where: { id: "1" } })).toBe(true);
      expect(result).toEqual(mockCollection);

      findOneStub.restore();
    });

    it("should return null if collection not found by id", async () => {
      const findOneStub = sinon.stub(Collection, "findOne").resolves(null);

      const result = await CreateCollectionService.getCollectionByid("999");

      expect(findOneStub.calledOnceWith({ where: { id: "999" } })).toBe(true);
      expect(result).toBeNull();

      findOneStub.restore();
    });
  });
});

describe("ProductService", () => {
  describe("createProduct", () => {
    it("should create a product", async () => {
      const productData = { name: "Test Product", price: 10 };
      const createStub = sinon
        .stub(Product, "create")
        .resolves(productData as any);

      const result = await ProductService.createProduct(productData);

      expect(createStub.calledOnceWith(productData)).toBeTruthy();
      expect(result).toEqual(productData);

      createStub.restore();
    });
  });

  describe("getProductByName", () => {
    it("should return product by name", async () => {
      const productName = "Test Product";
      const productData = { name: productName, price: 10 };
      const findOneStub = sinon
        .stub(Product, "findOne")
        .resolves(productData as any);

      const result = await ProductService.getProductByName(productName);

      expect(
        findOneStub.calledOnceWith({ where: { productName } })
      ).toBeTruthy();
      expect(result).toEqual(productData);

      findOneStub.restore();
    });
  });

  describe("getProductById", () => {
    it("should return product by id", async () => {
      const productId = "123";
      const productData = { id: productId, name: "Test Product", price: 10 };
      const findOneStub = sinon
        .stub(Product, "findOne")
        .resolves(productData as any);

      const result = await ProductService.getProductByid(productId);

      expect(
        findOneStub.calledOnceWith({ where: { id: productId } })
      ).toBeTruthy();
      expect(result).toEqual(productData);

      findOneStub.restore();
    });
  });

  describe("getProducts", () => {
    let findAllStub: sinon.SinonStub;

    beforeEach(() => {
      findAllStub = sinon.stub(Product, "findAll");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should return products based on the query", async () => {
      const query = {
        where: {
          productName: { $like: "%Test%" },
        },
      };
      const products = [{ name: "Test Product", price: 100 }];
      findAllStub.resolves(products);

      const result = await ProductService.getProducts(query);

      expect(findAllStub.calledOnceWith(query)).toBe(true);
      expect(result).toEqual(products);
    });

    it("should return an empty array if no products match the query", async () => {
      const query = {
        where: {
          productName: { $like: "%Nonexistent%" },
        },
      };
      findAllStub.resolves([]);

      const result = await ProductService.getProducts(query);

      expect(findAllStub.calledOnceWith(query)).toBe(true);
      expect(result).toEqual([]);
    });

    it("should handle errors and throw them", async () => {
      const query = {
        where: {
          productName: { $like: "%Error%" },
        },
      };
      const error = new Error("Something went wrong");
      findAllStub.rejects(error);

      try {
        await ProductService.getProducts(query);
      } catch (e) {
        expect(findAllStub.calledOnceWith(query)).toBe(true);
        expect(e).toEqual(error);
      }
    });
  });
});

describe("searchProducts", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let getProductsStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      query: {},
    };
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
    getProductsStub = sinon.stub(ProductService, "getProducts");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should search products by name", async () => {
    req.query = { search: "Test Product" };
    const products = [{ name: "Test Product", price: 100 }];
    getProductsStub.resolves(products);

    await searchProducts(req as Request, res as Response);

    expect(
      getProductsStub.calledOnceWith({
        where: { productName: { [Op.like]: "%Test Product%" } },
      })
    ).toBe(true);
    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(jsonStub.calledOnceWith({ products })).toBe(true);
  });

  it("should filter products by price range", async () => {
    req.query = { price_range: "50,150" };
    const products = [{ name: "Affordable Product", price: 100 }];
    getProductsStub.resolves(products);

    await searchProducts(req as Request, res as Response);

    expect(
      getProductsStub.calledOnceWith({
        where: { price: { [Op.between]: [50, 150] } },
      })
    ).toBe(true);
    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(jsonStub.calledOnceWith({ products })).toBe(true);
  });

  it("should filter products by category", async () => {
    req.query = { category: "electronics" };
    const products = [
      { name: "Smartphone", price: 300, category: "electronics" },
    ];
    getProductsStub.resolves(products);

    await searchProducts(req as Request, res as Response);

    expect(
      getProductsStub.calledOnceWith({
        where: { category: "electronics" },
      })
    ).toBe(true);
    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(jsonStub.calledOnceWith({ products })).toBe(true);
  });

  it("should combine search criteria", async () => {
    req.query = {
      search: "Smart",
      price_range: "200,400",
      category: "electronics",
    };
    const products = [
      { name: "Smartphone", price: 300, category: "electronics" },
    ];
    getProductsStub.resolves(products);

    await searchProducts(req as Request, res as Response);

    expect(
      getProductsStub.calledOnceWith({
        where: {
          productName: { [Op.like]: "%Smart%" },
          price: { [Op.between]: [200, 400] },
          category: "electronics",
        },
      })
    ).toBe(true);
    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(jsonStub.calledOnceWith({ products })).toBe(true);
  });
});


describe("markProductAvailable", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let getProductByIdStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
    getProductByIdStub = sinon.stub(ProductService, "getProductByid");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 404 if product is not found", async () => {
    const productId = "4be9b41c-5aa3-4862-991a-caada9c4a982";
    req.params.id = productId;
    getProductByIdStub.resolves(null);

    await markProductAvailable(req as Request, res as Response);

    expect(statusStub.calledOnceWith(404)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        status: "fail",
        message: "Product not found",
      })
    ).toBe(true);
  });

  it("should update availability and return 200 on success", async () => {
    const productId = "4be9b41c-5aa3-4862-991a-caada9c4a982";
    const availability = true;
    req.params.id = productId;
    req.body.availability = availability;
    const mockProduct = {
      id: productId,
      productName: "Test Product",
      description: "Sample description",
      price: 99.99,
      seller_id: "seller123",
      quantity: 5,
      expireDate: "2024-12-31",
      collection_id: "collection456",
      category: "electronics",
      availability: !availability, // Mocking current availability state
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      expired: false,
    };
    getProductByIdStub.resolves(mockProduct);
    const saveProductStub = sinon.stub().resolves(mockProduct);
    sinon.replace(mockProduct, "save", saveProductStub);

    await markProductAvailable(req as Request, res as Response);

    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        status: "success",
        message: "Product availability updated successfully",
        data: {
          product: {
            ...mockProduct,
            availability,
          },
        },
      })
    ).toBe(true);
    sinon.assert.calledOnce(saveProductStub);
  });

  it("should handle errors and return 500 if save operation fails", async () => {
    const productId = "4be9b41c-5aa3-4862-991a-caada9c4a982";
    const availability = true;
    req.params.id = productId;
    req.body.availability = availability;
    const mockProduct = {
      id: productId,
      productName: "Test Product",
      description: "Sample description",
      price: 99.99,
      seller_id: "seller123",
      quantity: 5,
      expireDate: "2024-12-31",
      collection_id: "collection456",
      category: "electronics",
      availability: !availability, // Mocking current availability state
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      expired: false,
    };
    getProductByIdStub.resolves(mockProduct);
    const errorMessage = "Database error";
    const saveProductStub = sinon.stub().rejects(new Error(errorMessage));
    sinon.replace(mockProduct, "save", saveProductStub);

    await markProductAvailable(req as Request, res as Response);

    expect(statusStub.calledOnceWith(500)).toBe(true);
    expect(
      jsonStub.calledOnceWith({
        status: "error",
        message: "An error occurred while updating the product availability",
      })
    ).toBe(true);
    sinon.assert.calledOnce(saveProductStub);
  });
});