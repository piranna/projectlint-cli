const cli = require("../../lib/cli");

test("json", function(done) {
  const rules = {
    dumb: {
      evaluate() {}
    }
  };

  // const config = ["dumb"];
  const config = {
    dumb: "warning"
  };

  const stdout = {
    write(data) {
      done(
        expect(data).toMatchInlineSnapshot(`
          "{
            \\"evaluates\\": {
              \\"/home/piranna/github/projectlint/cli\\": {
                \\"dumb\\": {
                  \\"level\\": 0
                }
              }
            }
          }"
        `)
      );
    }
  };

  cli(rules, config, "json", { stdout });
});
