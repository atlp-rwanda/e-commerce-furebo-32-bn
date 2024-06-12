import passport from "passport";
import { serialize } from "../src/services/Login-By-Google.services";
import sinon from 'sinon';
import User from '../src/database/models/user.model';
import { deserialize } from '../src/services/Login-By-Google.services';
serialize();

describe('passport.serializeUser', () => {
  it('should serialize user by id', (done) => {
    const user = {
      id: '12345',
      username: 'testuser',
    };

    const mockDone = jest.fn((err, id) => {
      try {

        expect(err).toBeNull();
        expect(id).toBe(user.id);
        done();
      } catch (error) {
        done(error);
      }
    });

    passport.serializeUser(user, mockDone);
  });
});


deserialize();

describe('passport.deserializeUser', () => {
  let findByPkStub: sinon.SinonStub;
  let doneSpy: sinon.SinonSpy;

  beforeEach(() => {

    findByPkStub = sinon.stub(User, 'findByPk');

    doneSpy = sinon.spy();
  });

  afterEach(() => {

    findByPkStub.restore();
  });

  it('should call done with the user when user is found', async () => {
    const fakeUser = { id: '123', name: 'Test User' };
    findByPkStub.resolves(fakeUser);

    const id = '123';

    await new Promise<void>((resolve) => {
      passport.deserializeUser(id, doneSpy);
      setTimeout(() => resolve(), 0); 
    });

    sinon.assert.calledOnce(findByPkStub);
    sinon.assert.calledWith(findByPkStub, id);
    sinon.assert.calledWith(doneSpy, null, fakeUser);
  });

  it('should call done with an error when user is not found', async () => {
    const error = new Error('User not found');
    findByPkStub.rejects(error);

    const id = '123';

    await new Promise<void>((resolve) => {
      passport.deserializeUser(id, doneSpy);
      setTimeout(() => resolve(), 0); 
    });

    sinon.assert.calledOnce(findByPkStub);
    sinon.assert.calledWith(findByPkStub, id);
    sinon.assert.calledWith(doneSpy, error);
  });
});
