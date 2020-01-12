const cli = require('../lib/cli')


test('no arguments', function()
{
  function func() {
    cli();
  }

  expect(func).toThrowErrorMatchingInlineSnapshot(
    `"\`rules\` argument must be set"`
  );
})
