const cli = require("../../lib/cli");

test("success", function() {
  const rules = {
    dumb: {
      evaluate() {}
    }
  };

  // const config = ["dumb"];
  const config = {
    dumb: "warning"
  };

  const buffer = [];
  const stdout = {
    write(data) {
      buffer.push(data);
    }
  };

  return cli(rules, config, "tasktree", { stdout }).then(function() {
    expect(buffer).toMatchInlineSnapshot(`
      Array [
        "[?25l",
        "  [38;2;66;133;244m❯[39m /home/piranna/github/projectlint/cli
      [38;2;131;133;132m  [38;2;46;46;46m›[39m[38;2;131;133;132m [38;2;0;200;81m✔[39m[38;2;131;133;132m dumb[39m
      ",
        "[?25h",
        "[?25l",
        "[?25h",
      ]
    `);
  });
});
