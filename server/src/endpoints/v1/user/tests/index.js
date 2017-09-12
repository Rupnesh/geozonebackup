/**
 * Created by mariuspotor on 10/16/16.
 */

const { User } = require('../controller');
const { Register } = require('../../register/controller');

const expect = require('chai').expect;

module.exports = () => {
  const item = {
    firstname: 'Marius',
    lastname: 'Potor',
    email: 'marius@moduscreate.com',
    photo: 'http://example.jpg'
  };

  let itemId;
  describe('User', () => {
    it('add an item', () => Register
      .add(item)
      .then((data) => {
        itemId = data.dataValues.id;
      })
    );

    it('list all items', () => User
      .list()
      .then((data) => {
        expect(data)
          .to.be.an('array')
          .to.have.length.of.at.least(1);
      })
    );

    it('get item', () => User
      .get(itemId)
      .then((data) => {
        expect(data.dataValues)
          .to.be.an('object')
          .to.include.keys('id');
      })
    );

    it('remove item', () => Register
      .remove(itemId)
      .then((data) => {
        expect(data)
          .to.equal(1);
      })
    );
  });
};
