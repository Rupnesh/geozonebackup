/**
 * Created by mariuspotor on 10/16/16.
 */

const { Register } = require('../controller');

const expect = require('chai').expect;

module.exports = () => {
  const item = {
    firstname: 'Marius',
    lastname: 'Potor',
    email: 'marius@moduscreate.com',
    photo: 'http://example.jpg'
  };

  let itemId;
  describe('Register', () => {
    it('add an register item', () => Register
      .add(item)
      .then((data) => {
        itemId = data.dataValues.id;
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
