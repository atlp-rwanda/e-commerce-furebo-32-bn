import { expect, test } from "@jest/globals"
import request from "supertest"
import app from "../app"


describe("Testing home route", () => {
    test("should return 200 status code", async() => {
        const response = await request(app).get("/")
        expect(response.body.message).toBe("welcome to ATLP Backend APIs");
        expect(response.statusCode).toBe(200)
    })
})