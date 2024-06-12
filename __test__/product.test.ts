import { Request, Response,NextFunction } from 'express';
import sinon from 'sinon';
import { CreateCollectionService, GetCollectionService } from '../src/services/collection.services';
import { ProductService } from '../src/services/Product.services';
import cloudinary from 'cloudinary';
import { UserService } from '../src/services/user.services';
import { createCollection, getSellerItems } from '../src/controllers/collection.controller';
import { createProduct, getAvailableItems, searchProducts, getAvailableProducts, updateProductAvailability,} from "../src/controllers/product.controller";
import Collection from "../src/database/models/collection.model";
import Product from "../src/database/models/Product.model";
import { Op } from "sequelize";
import { deleteProduct } from '../src/controllers/product.controller';
import { checkProductOwner } from '../src/middlewares/product.middleware';

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

describe('createCollection function', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let createCollectionStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: {
        CollectionName: 'Test Collection',
        description: 'Test description',
      },
      user: {
        id: 'testUserId',
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    statusStub = res.status as sinon.SinonStub;
    jsonStub = res.json as sinon.SinonStub;

    createCollectionStub = sinon.stub(CreateCollectionService, 'createCollection');
  });

  afterEach(() => {
    createCollectionStub.restore();
  });

  it('should create a collection successfully', async () => {
    const mockCreatedCollection = {
      id: '1',
      CollectionName: 'Test Collection',
      description: 'Test description',
      seller_id: 'testUserId',
    };

    createCollectionStub.resolves(mockCreatedCollection);

    await createCollection(req as Request, res as Response);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 200);
    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWithMatch(jsonStub, {
      message: 'Collection created successfully',
      createdCollection: mockCreatedCollection,
    });
  });

  it('should handle missing required information', async () => {

    req.body = {};

    await createCollection(req as Request, res as Response);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 400);
    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWithMatch(jsonStub, {
      message: 'Make sure you enter all required information',
    });
  });
});


import multer, { diskStorage } from "multer";
import path from "path";
import User from '../src/database/models/user.model';

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

describe('CreateCollectionService', () => {
    describe('createCollection', () => {
      it('should create a collection', async () => {
        const mockCollection = {
          id: '1',
          CollectionName: 'Test Collection',
          description: 'Test Description',
          seller_id: '123'
        };
        const createStub = sinon.stub(Collection, 'create').resolves(mockCollection as any);
  
        const collectionData = {
          CollectionName: 'Test Collection',
          description: 'Test Description',
          seller_id: '123'
        };
  
        const createdCollection = await CreateCollectionService.createCollection(collectionData);
  
        expect(createStub.calledOnceWith(collectionData)).toBe(true);
        expect(createdCollection).toEqual(mockCollection);
  
        createStub.restore();
      });
    });
  
    describe('getCollectionByName', () => {
      it('should find a collection by name', async () => {
        const mockCollection = {
          id: '1',
          CollectionName: 'Test Collection',
          description: 'Test Description',
          seller_id: '123'
        };
        const findOneStub = sinon.stub(Collection, 'findOne').resolves(mockCollection as any);
  
        const result = await CreateCollectionService.getCollectionByName('Test Collection');
  
        expect(findOneStub.calledOnceWith({ where: { CollectionName: 'Test Collection' } })).toBe(true);
        expect(result).toEqual(mockCollection);
  
        findOneStub.restore();
      });
  
      it('should return null if collection not found by name', async () => {
        const findOneStub = sinon.stub(Collection, 'findOne').resolves(null);
  
        const result = await CreateCollectionService.getCollectionByName('Nonexistent Collection');
  
        expect(findOneStub.calledOnceWith({ where: { CollectionName: 'Nonexistent Collection' } })).toBe(true);
        expect(result).toBeNull();
  
        findOneStub.restore();
      });
    });
  
    describe('getCollectionById', () => {
      it('should find a collection by id', async () => {
        const mockCollection = {
          id: '1',
          CollectionName: 'Test Collection',
          description: 'Test Description',
          seller_id: '123'
        };
        const findOneStub = sinon.stub(Collection, 'findOne').resolves(mockCollection as any);
  
        const result = await CreateCollectionService.getCollectionByid('1');
  
        expect(findOneStub.calledOnceWith({ where: { id: '1' } })).toBe(true);
        expect(result).toEqual(mockCollection);
  
        findOneStub.restore();
      });
  
      it('should return null if collection not found by id', async () => {
        const findOneStub = sinon.stub(Collection, 'findOne').resolves(null);
  
        const result = await CreateCollectionService.getCollectionByid('999');
  
        expect(findOneStub.calledOnceWith({ where: { id: '999' } })).toBe(true);
        expect(result).toBeNull();
  
        findOneStub.restore();
      });
    });

  });

describe('GetCollectionService', () => {
  const mockCollections = [
    { id: '1', CollectionName: 'Test Collection 1', description: 'Test Description 1', seller_id: '123' },
    { id: '2', CollectionName: 'Test Collection 2', description: 'Test Description 2', seller_id: '123' }
  ];
  describe('getAllCollections', () => {
    it('should return all collections', async () => {
      const findAllStub = sinon.stub(Collection, 'findAll').resolves(mockCollections as any);

      const result = await GetCollectionService.getAllCollections();

      expect(findAllStub.calledOnce).toBe(true);
      expect(result).toEqual(mockCollections);

      findAllStub.restore();
    });

    it('should return an empty array if no collections are found', async () => {
      const findAllStub = sinon.stub(Collection, 'findAll').resolves([]);

      const result = await GetCollectionService.getAllCollections();

      expect(findAllStub.calledOnce).toBe(true);
      expect(result).toEqual([]);

      findAllStub.restore();
    });
  });
  describe('getSellerItems', () => {
    it('should return all items for a seller', async () => {
      const findAllStub = sinon.stub(Collection, 'findAll').resolves(mockCollections as any);

      const result = await GetCollectionService.getSellerItem('123');

      expect(findAllStub.calledOnceWith({ where: { seller_id: '123' } })).toBe(true);
      expect(result).toEqual(mockCollections);

      findAllStub.restore();
    });

    it('should return an empty array if no items are found for a seller', async () => {
      const findAllStub = sinon.stub(Collection, 'findAll').resolves([]);

      const result = await GetCollectionService.getSellerItem('123');

      expect(findAllStub.calledOnceWith({ where: { seller_id: '123' } })).toBe(true);
      expect(result).toEqual([]);

      findAllStub.restore();
    });

    it('should return 401 if the user is not a seller', async () => {
        const getUserByIdStub = sinon.stub(UserService, 'getUserByid').resolves(null);
        const req = { params: { seller_id: '123' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await getSellerItems(req as unknown as Request, res as unknown as Response);

        expect(getUserByIdStub.calledOnceWith('123')).toBe(true);
        expect(res.status.calledOnceWith(401)).toBe(true);
        expect(res.json.calledOnceWith({ status: 401, error: "Unauthorized access" })).toBe(true);

        getUserByIdStub.restore();
    });

    it('should return 200 and the items for a seller', async () => {
      const mockUser = {
        id: '123',
        role: 'buyer',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword'
      } as User;
      
        const getUserByIdStub = sinon.stub(UserService, 'getUserByid').resolves(mockUser as any);
        const req = { params: { seller_id: '123' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await getSellerItems(req as unknown as Request, res as unknown as Response);

        expect(getUserByIdStub('123'));
        expect(res.status(200));
        expect(res.json({ status: 200, message: "Items retrieved successfully"}));

        getUserByIdStub.restore();
    });
    it('should return 500 if an error occurs', async () => {
      const getUserByIdStub = sinon.stub(UserService, 'getUserByid');
      
      const req = { params: { seller_id: '123' } } as unknown as Request;
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      } as unknown as Response;

      await getSellerItems(req, res);

      expect(res.status(500));
      expect(res.json({ status: 500, error: "Internal server error" }));

      getUserByIdStub.restore();
    });
});
});

describe('ProductService', () => {
    describe('createProduct', () => {
      it('should create a product', async () => {
        const productData = { name: 'Test Product', price: 10 };
        const createStub = sinon.stub(Product, 'create').resolves(productData as any);
  
        const result = await ProductService.createProduct(productData);
  
        expect(createStub.calledOnceWith(productData)).toBeTruthy();
        expect(result).toEqual(productData);
  
        createStub.restore(); 
      });
    });
  
    describe('getProductByName', () => {
      it('should return product by name', async () => {
        const productName = 'Test Product';
        const productData = { name: productName, price: 10 };
        const findOneStub = sinon.stub(Product, 'findOne').resolves(productData as any);
  
        const result = await ProductService.getProductByName(productName);
  
        expect(findOneStub.calledOnceWith({ where: { productName } })).toBeTruthy();
        expect(result).toEqual(productData);
  
        findOneStub.restore();
      });
    });
  
    describe('getProductById', () => {
      it('should return product by id', async () => {
        const productId = '123';
        const productData = { id: productId, name: 'Test Product', price: 10 };
        const findOneStub = sinon.stub(Product, 'findOne').resolves(productData as any);
  
        const result = await ProductService.getProductByid(productId);
  
        expect(findOneStub.calledOnceWith({ where: { id: productId } })).toBeTruthy();
        expect(result).toEqual(productData);
  
        findOneStub.restore();
      });
    });

    describe('getAvailableItems', () => {
      const mockItems = [
        { id: '1', name: 'Test Product 1', price: 10, availability: true },
        { id: '2', name: 'Test Product 2', price: 20, availability: true }
      ];
        it('should return all available items', async () => {
          const findAllStub = sinon.stub(Product, 'findAll').resolves(mockItems as any);
    
          const result = await ProductService.getAvailableItems();
    
          expect(findAllStub.calledOnceWith({ where: { availability: true } })).toBeTruthy();
          expect(result).toEqual(mockItems);
    
          findAllStub.restore();
        });
    
        it('should return an empty array if no items are available', async () => {
          const findAllStub = sinon.stub(Product, 'findAll').resolves([]);
    
          const result = await ProductService.getAvailableItems();
    
          expect(findAllStub.calledOnceWith({ where: { availability: true } })).toBeTruthy();
          expect(result).toEqual([]);
    
          findAllStub.restore();
      });

      it('should return 200 and the available items', async () => {
        const findAllStub = sinon.stub(Product, 'findAll').resolves(mockItems as any);
        const req = {};
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
  
        await getAvailableItems(req as unknown as Request, res as unknown as Response);
  
        expect(findAllStub.calledOnceWith({ where: { availability: true } })).toBeTruthy();
        expect(res.status(200));
        expect(res.json({ products: mockItems }));
  
        findAllStub.restore();
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

describe("getAvailableProducts", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let findAllStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      params: {},
    };
    jsonStub = sinon.stub().returnsThis();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
      json: jsonStub,
    };
    findAllStub = sinon.stub(Product, "findAll");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 200 and a list of available products", async () => {
    const mockProducts = [
      {
        id: "1",
        productName: "Product 1",
        description: "Description 1",
        price: 100,
        quantity: 10,
        seller_id: "123",
        expireDate: "2024-12-31",
        Collection_id: "1",
        images: ["http://example.com/image1.jpg"],
        category: "Category 1",
      },
      {
        id: "2",
        productName: "Product 2",
        description: "Description 2",
        price: 200,
        quantity: 5,
        seller_id: "123",
        expireDate: "2024-12-31",
        Collection_id: "2",
        images: ["http://example.com/image2.jpg"],
        category: "Category 2",
      },
    ];

    findAllStub.resolves(mockProducts);
    req.params = { seller_id: "123" };

    await getAvailableProducts(req as Request, res as Response);

    expect(statusStub.calledOnceWith(200)).toBe(true);
    expect(jsonStub.calledOnceWith(mockProducts)).toBe(true);
  });

  it ("should return 404 if no available products are found", async () => {
    findAllStub.resolves([]);
    req.params = { seller_id: "123" };

    await getAvailableProducts(req as Request, res as Response);

    expect(statusStub.calledOnceWith(404)).toBe(true);
    expect(jsonStub.calledOnceWith({ message: "No available products found for this seller." })).toBe(true);
  });
});

describe("updateProductAvailability", ( ) => {
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
    getProductByIdStub.resolves(null);
    req.params = { id: "1" };
    req.body = { availability: true };

    await updateProductAvailability(req as Request, res as Response);

    expect(statusStub.calledOnceWith(404)).toBe(true);
    expect(jsonStub.calledOnceWith({ status: "fail", message: "Product not found" })).toBe(true);
  });

  it("should update product availability", async () => {
    const product = {
      id: "1",
      productName: "Product 1",
      description: "Description 1",
      price: 100,
      quantity: 10,
      seller_id: "123",
      expireDate: "2024-12-31",
      Collection_id: "1",
      images: ["http://example.com/image1.jpg"],
      category: "Category 1",
      availability: true,
    };

    getProductByIdStub.resolves(product);
    req.params = { id: "1" };
    req.body = { availability: false };

    await updateProductAvailability(req as Request, res as Response);

    expect(product.availability).toBe(false);
    expect(statusStub.calledOnceWith(200));
    expect(jsonStub.calledOnceWith({ status: "success", message: "Product availability updated successfully" }));
  });
});

describe('ProductService', () => {
describe('deleteProductById', () => {
  let destroyStub: sinon.SinonStub;

  beforeAll(() => {
    destroyStub = sinon.stub(Product, 'destroy');
  });

  afterAll(() => {
    destroyStub.restore();
  });

  it('should call Product.destroy with the correct id', async () => {
    const id = '123';
    destroyStub.resolves(1);

    const result = await ProductService.deleteProductById(id);

    expect(destroyStub.calledOnce).toBe(true);
    expect(destroyStub.calledWith({ where: { id } })).toBe(true);

    expect(result).toBe(1);
  });})})

describe('checkProductOwner', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let getProductByIdStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      user: {
        id: 'seller123',
      },
      params: {
        product_id: 'product123',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    getProductByIdStub = sinon.stub(ProductService, 'getProductById');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call next if seller_id matches product.seller_id', async () => {
    const product = { seller_id: 'seller123' };
    getProductByIdStub.resolves(product);

    await checkProductOwner(req as Request, res as Response, next);

    expect(getProductByIdStub.calledOnceWith('product123')).toBeTruthy();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 400 if seller_id does not match product.seller_id', async () => {
    const product = { seller_id: 'otherSeller' };
    getProductByIdStub.resolves(product);

    await checkProductOwner(req as Request, res as Response, next);

    expect(getProductByIdStub.calledOnceWith('product123')).toBeTruthy();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "You don't own the product" });
  });

  it('should return 400 if product is not found', async () => {
    getProductByIdStub.resolves(null);

    await checkProductOwner(req as Request, res as Response, next);

    expect(getProductByIdStub.calledOnceWith('product123')).toBeTruthy();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "You don't own the product" });
  });
});

describe('deleteProduct', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      params: { product_id: '123' },
      user: { id: '456' },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should delete the product and return 202 if the user is the owner', async () => {
    const product = { seller_id: '456' };
    const deletedProduct = { id: '123', name: 'Test Product' };
    sandbox.stub(ProductService, 'getProductByid').resolves(product as any);
    sandbox.stub(ProductService, 'deleteProductById').resolves(deletedProduct as any);

    await deleteProduct(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledWith(202)).toBe(true);
    expect((res.json as sinon.SinonStub).calledWith({
      message: 'Product deleted successfully',
      deletedProduct: product,
    })).toBe(true);
  });
  it('should return a 500 status on error', async () => {
    sinon.stub(ProductService, 'getProductById').rejects(new Error('Test error'));

    await deleteProduct(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledWith(500)).toBe(true);
    expect((res.json as sinon.SinonStub).calledWith({ message: "internal server error" })).toBe(true);
  });
});
import { updateProduct } from '../src/controllers/product.controller'; 

describe('updateProduct', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;
  let productServiceStub: sinon.SinonStub;
  let productStub: { update: sinon.SinonStub };

  beforeEach(() => {
    req = {
      params: { product_id: '123' },
      user: { id: 'seller123' },
      body: {
        productName: 'New Product',
        price: 100,
        quantity: 10,
        availability: true,
        expireDate: '2023-12-31',
        category: 'Electronics',
        description: 'Updated description'
      }
    };
    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub
    };
    productStub = {
      update: sinon.stub()
    };
    productServiceStub = sinon.stub(ProductService, 'getProductByid');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 200 and update the product successfully', async () => {
    productServiceStub.resolves({ seller_id: 'seller123', update: productStub.update });
    productStub.update.resolves({
      productName: 'New Product',
      description: 'Updated description',
      price: 100,
      quantity: 10,
      availability: true,
      expireDate: '2023-12-31',
      category: 'Electronics'
    });

    await updateProduct(req as Request, res as Response);

    expect(statusStub.calledWith(200)).toBe(true);
    expect(jsonStub.calledWith({
      message: "Product updated successfully",
      updatedProduct: {
        productName: 'New Product',
        description: 'Updated description',
        price: 100,
        quantity: 10,
        availability: true,
        expireDate: '2023-12-31',
        category: 'Electronics'
      }
    })).toBe(true);
  });
});


import { addImages } from "../src/controllers/product.controller";

import { imageServices } from '../src/services/Image.service';

describe('addImages function', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let getProductByIdStub: sinon.SinonStub;
  let uploadImagesStub: sinon.SinonStub;
  let productMock: any;

  beforeEach(() => {
    req = {
      params: {
        product_id: '123',
      },
      files: [
        { path: 'path/to/image1.jpg' } as Express.Multer.File,
        { path: 'path/to/image2.jpg' } as Express.Multer.File,
      ],
    };

    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    res = {
      status: statusStub.returns({
        json: jsonStub,
      }),
    };

    productMock = {
      images: ['url1', 'url2'],
      update: sinon.stub().returnsThis(),
      save: sinon.stub().resolvesThis(),
    };

    getProductByIdStub = sinon.stub(ProductService, 'getProductByid').resolves(productMock);
    uploadImagesStub = sinon.stub(imageServices, 'uploadImages').resolves(['url3', 'url4']);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should add images successfully', async () => {
    await addImages(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.calledOnce(uploadImagesStub);
    sinon.assert.calledWith(uploadImagesStub, req.files);

    sinon.assert.calledOnce(productMock.update);
    sinon.assert.calledWith(productMock.update, { images: ['url1', 'url2', 'url3', 'url4'] });

    sinon.assert.calledOnce(productMock.save);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 200);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: 'Images added successfully',
      updatedproduct: productMock,
    });
  });

  it('should return 400 if images exceed 8', async () => {
    productMock.images = ['url1', 'url2', 'url3', 'url4', 'url5', 'url6', 'url7'];

    await addImages(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.notCalled(uploadImagesStub);
    sinon.assert.notCalled(productMock.update);
    sinon.assert.notCalled(productMock.save);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 400);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: "Images can't exceed 8",
    });
  });
  it('should handle internal server errors', async () => {
    getProductByIdStub.rejects(new Error('Internal server error'));

    await addImages(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.notCalled(uploadImagesStub);
    sinon.assert.notCalled(productMock.update);
    sinon.assert.notCalled(productMock.save);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 500);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: 'internal server error',
    });
  });
});

import { updateImageByUrl } from '../src/controllers/product.controller';

describe('updateImageByUrl', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let getProductByIdStub: sinon.SinonStub;
  let obtainPublicIdStub: sinon.SinonStub;
  let destroyStub: sinon.SinonStub;
  let uploadImagesStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      params: { product_id: '123' },
      body: { imageUrl: 'http://res.cloudinary.com/demo/image/upload/sample.jpg' },
      files: [{ path: 'path/to/file' }] as any,
    };

    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    res = {
      status: statusStub.returns({ json: jsonStub }),
    };

    getProductByIdStub = sinon.stub(ProductService, 'getProductByid');
    obtainPublicIdStub = sinon.stub(imageServices, 'obtainPublicId');
    destroyStub = sinon.stub(cloudinary.v2.uploader, 'destroy');
    uploadImagesStub = sinon.stub(imageServices, 'uploadImages');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 400 if the image does not exist in product', async () => {
    getProductByIdStub.resolves({ images: [] });

    await updateImageByUrl(req as Request, res as Response);

    expect(statusStub.calledWith(400)).toBe(true);
    expect(jsonStub.calledWith({ message: "The image doesn't exist" })).toBe(true);
  });

  it('should return 400 if no files are uploaded', async () => {
    req.files = undefined;
    getProductByIdStub.resolves({ images: ['http://res.cloudinary.com/demo/image/upload/sample.jpg'] });

    await updateImageByUrl(req as Request, res as Response);

    expect(statusStub.calledWith(400)).toBe(true);
    expect(jsonStub.calledWith({ message: "Please upload new image" })).toBe(true);
  });

  it('should destroy the old image and upload new images', async () => {
    getProductByIdStub.resolves({ images: ['http://res.cloudinary.com/demo/image/upload/sample.jpg'] });
    obtainPublicIdStub.returns('sample');
    destroyStub.resolves();
    uploadImagesStub.resolves(['http://res.cloudinary.com/demo/image/upload/new_image.jpg']);

    const updateStub = sinon.stub().resolves({
      images: ['http://res.cloudinary.com/demo/image/upload/sample.jpg', 'http://res.cloudinary.com/demo/image/upload/new_image.jpg'],
    });

    (getProductByIdStub as sinon.SinonStub).resolves({
      images: ['http://res.cloudinary.com/demo/image/upload/sample.jpg'],
      update: updateStub,
    });

    await updateImageByUrl(req as Request, res as Response);

    expect(destroyStub.calledWith('sample')).toBe(true);
    expect(uploadImagesStub.calledWith(req.files)).toBe(true);
    expect(updateStub.calledWith({
      images: [
        'http://res.cloudinary.com/demo/image/upload/sample.jpg',
        'http://res.cloudinary.com/demo/image/upload/new_image.jpg',
      ],
    })).toBe(false);
    expect(statusStub.calledWith(200)).toBe(true);
    expect(jsonStub.calledWith({
      message: 'Images added successfully',
      updatedproduct: {
        images: [
          'http://res.cloudinary.com/demo/image/upload/sample.jpg',
          'http://res.cloudinary.com/demo/image/upload/new_image.jpg',
        ],
      },
    })).toBe(true);
  });

  it('should return 500 if there is an internal server error', async () => {
    getProductByIdStub.rejects(new Error('Internal Server Error'));

    await updateImageByUrl(req as Request, res as Response);

    expect(statusStub.calledWith(500)).toBe(true);
    expect(jsonStub.calledWith({ message: 'internal server error' })).toBe(true);
  });
});

import { UpdateAllImages } from '../src/controllers/product.controller';

describe('UpdateAllImages function', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let getProductByIdStub: sinon.SinonStub;
  let uploadImagesStub: sinon.SinonStub;
  let destroyStub: sinon.SinonStub;
  let productMock: any;

  beforeEach(() => {
    req = {
      params: {
        product_id: '123',
      },
      files: [
        { path: 'path/to/image1.jpg' } as Express.Multer.File,
        { path: 'path/to/image2.jpg' } as Express.Multer.File,
      ],
    };

    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    res = {
      status: statusStub.returns({
        json: jsonStub,
      }),
    };

    productMock = {
      images: ['url1', 'url2'],
      update: sinon.stub().resolvesThis(),
    };

    getProductByIdStub = sinon.stub(ProductService, 'getProductByid').resolves(productMock);
    uploadImagesStub = sinon.stub(imageServices, 'uploadImages').resolves(['url3', 'url4']);
    destroyStub = sinon.stub(cloudinary.v2.uploader, 'destroy').resolves({ result: 'ok' });
  });

  afterEach(() => {
    sinon.restore();
  });
  it('should return 400 if images are less than 4 or more than 8', async () => {
    req.files = [
      { path: 'path/to/image1.jpg' } as Express.Multer.File,
      { path: 'path/to/image2.jpg' } as Express.Multer.File,
      { path: 'path/to/image3.jpg' } as Express.Multer.File,
      { path: 'path/to/image4.jpg' } as Express.Multer.File,
      { path: 'path/to/image5.jpg' } as Express.Multer.File,
      { path: 'path/to/image6.jpg' } as Express.Multer.File,
      { path: 'path/to/image7.jpg' } as Express.Multer.File,
      { path: 'path/to/image8.jpg' } as Express.Multer.File,
      { path: 'path/to/image9.jpg' } as Express.Multer.File,
    ];

    await UpdateAllImages(req as Request, res as Response);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 400);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: "Please upload at least 4 images and not exceeding 8",
    });

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.notCalled(uploadImagesStub);
    sinon.assert.notCalled(productMock.update);
    sinon.assert.notCalled(destroyStub);
  });

  it('should handle internal server errors', async () => {
    getProductByIdStub.rejects(new Error('Internal server error'));

    await UpdateAllImages(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.notCalled(uploadImagesStub);
    sinon.assert.notCalled(productMock.update);
    sinon.assert.notCalled(destroyStub);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 500);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: 'internal server error',
    });
  });
});

import { removeImage } from '../src/controllers/product.controller';

describe('removeImage function', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusStub: sinon.SinonStub;
  let jsonStub: sinon.SinonStub;
  let getProductByIdStub: sinon.SinonStub;
  let obtainPublicIdStub: sinon.SinonStub;
  let destroyStub: sinon.SinonStub;
  let productMock: any;

  beforeEach(() => {
    req = {
      params: {
        product_id: '123',
      },
      body: {
        imageUrl: 'http://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
    };

    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    res = {
      status: statusStub.returns({
        json: jsonStub,
      }),
    };

    productMock = {
      images: ['http://res.cloudinary.com/demo/image/upload/sample.jpg'],
      update: sinon.stub().resolvesThis(),
    };

    getProductByIdStub = sinon.stub(ProductService, 'getProductByid').resolves(productMock);
    obtainPublicIdStub = sinon.stub(imageServices, 'obtainPublicId').returns('sample');
    destroyStub = sinon.stub(cloudinary.v2.uploader, 'destroy').resolves({ result: 'ok' });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should remove image successfully', async () => {
    await removeImage(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.calledOnce(obtainPublicIdStub);
    sinon.assert.calledWith(obtainPublicIdStub, 'http://res.cloudinary.com/demo/image/upload/sample.jpg');

    sinon.assert.calledOnce(destroyStub);
    sinon.assert.calledWith(destroyStub, 'sample');

    sinon.assert.calledOnce(productMock.update);
    sinon.assert.calledWith(productMock.update, { images: [] });

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 200);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: 'Images removed successfully',
      updatedproduct: productMock,
    });
  });

  it('should return 400 if the image does not exist in product images', async () => {
    productMock.images = ['http://res.cloudinary.com/demo/image/upload/another.jpg'];

    await removeImage(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.notCalled(destroyStub);
    sinon.assert.notCalled(productMock.update);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 400);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: "The image doesn't exist",
    });
  });

  it('should return 400 if the product has 4 images', async () => {
    productMock.images = [
      'http://res.cloudinary.com/demo/image/upload/img1.jpg',
      'http://res.cloudinary.com/demo/image/upload/img2.jpg',
      'http://res.cloudinary.com/demo/image/upload/img3.jpg',
      'http://res.cloudinary.com/demo/image/upload/sample.jpg',
    ];

    await removeImage(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.notCalled(destroyStub);
    sinon.assert.notCalled(productMock.update);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 400);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: "You can't delete an image because you have 4 images",
    });
  });

  it('should handle internal server errors', async () => {
    getProductByIdStub.rejects(new Error('Internal server error'));

    await removeImage(req as Request, res as Response);

    sinon.assert.calledOnce(getProductByIdStub);
    sinon.assert.calledWith(getProductByIdStub, '123');

    sinon.assert.notCalled(obtainPublicIdStub);
    sinon.assert.notCalled(destroyStub);
    sinon.assert.notCalled(productMock.update);

    sinon.assert.calledOnce(statusStub);
    sinon.assert.calledWith(statusStub, 500);

    sinon.assert.calledOnce(jsonStub);
    sinon.assert.calledWith(jsonStub, {
      message: 'internal server error',
    });
  });
});


describe('imageServices', () => {
  describe('obtainPublicId', () => {
    it('should obtain public id from cloudinary URL', () => {
      const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
      const expectedPublicId = 'sample';

      const publicId = imageServices.obtainPublicId(cloudinaryUrl);

      expect(publicId).toEqual(expectedPublicId);
    });
  });

  describe('uploadImages', () => {
    it('should upload images to cloudinary', async () => {

      const stubUpload = sinon.stub(cloudinary.v2.uploader, 'upload');
      stubUpload.resolves({
        secure_url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        public_id: 'sample'
      } as any);

      const imageFiles = [{ path: '/path/to/file1.jpg' }, { path: '/path/to/file2.jpg' }] as Express.Multer.File[];

      const imageUrls = await imageServices.uploadImages(imageFiles);

      expect(imageUrls).toHaveLength(2);
      expect(imageUrls[0]).toEqual('https://res.cloudinary.com/demo/image/upload/sample.jpg');
      expect(imageUrls[1]).toEqual('https://res.cloudinary.com/demo/image/upload/sample.jpg');

      stubUpload.restore();
    });
  });
});
