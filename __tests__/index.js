test("smoke", function() {
  const result = require("..");

  expect(result).toMatchInlineSnapshot(`
    Object {
      "cli": [Function],
      "parseArgs": [Function],
    }
  `);
});
