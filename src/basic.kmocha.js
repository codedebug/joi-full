import "core-js"; // polyfill
import expect from 'expect';
import Joi from '../'; // joi-full includes extensions

describe('Joi', () => {

  describe('basic schema', () => {
    let schema;

    beforeEach(() => {
      schema = Joi.object().keys({
        createDate: Joi.date().format('YYYY-MM-DD'),
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        access_token: [Joi.string(), Joi.number()],
        birthyear: Joi.number().integer().min(1900).max(2013),
        email: Joi.string().email()
      }).with('username', 'birthyear').without('password', 'access_token');
    });

    it('should validate a valid object', () => {
      const obj = {
        createDate: '2001-01-02',
        username: 'abc',
        birthyear: 1994
      };
      const result = Joi.validate(obj, schema)
      expect(result.error).toNotExist();
      expect(result.value).toEqual({
        "createDate": new Date("2001-01-02T06:00:00.000Z"),
        "username": "abc",
        "birthyear": 1994
      });
    });

    it('should error on an invalid object (invalid date)', () => {
      const obj = {
        createDate: '01-02', // invalid date
        username: 'abc',
        birthyear: 1994
      };
      const result = Joi.validate(obj, schema)
      // check that error message
      expect(result.error.toString()).toMatch('YYYY-MM-DD');
    });

  });

});
