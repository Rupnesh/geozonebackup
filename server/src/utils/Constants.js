/**
 * Created by mariuspotor on 21/11/2016.
 */
const EMAIL_REGEX = new RegExp(['^[-a-z0-9~!$%^&*_=+}{\'?]+(.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]',
  '*(.[-a-z0-9_]+)*.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net',
  '|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}',
  '))(:[0-9]{1,5})?$'].join(''));

module.exports = {
  EMAIL_REGEX
};
