const cli = require("../lib/cli");

test("no arguments", function() {
  function func() {
    cli();
  }

  expect(func).toThrowErrorMatchingInlineSnapshot(
    `"The \\"path\\" argument must be of type string. Received undefined"`
  );
});
